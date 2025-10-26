from __future__ import annotations

from typing import Dict, Any, List, Tuple

# Public schema hint for users of the package/CLI
SCHEMA_FIELDS: List[str] = [
    "location_id",  # string identifier of the location/camp
    # Population and density
    "population",  # total population (int)
    "area_km2",  # area in square kilometers (float) [optional if crowd_density provided]
    "crowd_density",  # people per km^2 (float) [optional if area_km2 provided]
    # Food/water
    "food_supply_days",  # days of food rations left per person (float)
    "water_lpd",  # liters per person per day available (float)
    # Health/disease
    "health_severity_0_1",  # health risk severity [0-1], 1 worst (float)
    "disease_incidence_per_1k",  # cases per 1k population (float)
    # Weather/disaster
    "weather_severity_0_1",  # weather/disaster severity [0-1] (float)
    "disaster_flag",  # boolean-like (0/1 or true/false)
    # Movement trends
    "influx_percent_7d",  # percent influx over last 7 days; e.g., 25 means +25% (float)
]


def _clamp01(x: float) -> float:
    return 0.0 if x < 0 else 1.0 if x > 1 else x


def _lin_scale(x: float, x0: float, x1: float, invert: bool = False) -> float:
    """Linear scale x between x0 (->0) and x1 (->1). If invert, swap mapping."""
    if x0 == x1:
        return 0.0
    t = (x - x0) / (x1 - x0)
    t = _clamp01(t)
    return 1 - t if invert else t


def _density_score(row: Dict[str, Any]) -> Tuple[float, str]:
    # prefer explicit crowd_density; else compute from population/area if both given
    density = row.get("crowd_density")
    if density is None:
        pop = row.get("population")
        area = row.get("area_km2")
        if pop is not None and area not in (None, 0):
            try:
                density = float(pop) / float(area)
            except Exception:
                density = None
    if density is None:
        return None, "density:missing"
    try:
        d = float(density)
    except Exception:
        return None, "density:invalid"
    # Map: <=500 ppl/km2 -> 0 urgency, >=5000 -> 1
    score = _lin_scale(d, 500.0, 5000.0)
    return score, f"density:{d:.1f}/km2->{score:.2f}"


def _food_score(row: Dict[str, Any]) -> Tuple[float, str]:
    days = row.get("food_supply_days")
    if days is None:
        return None, "food:missing"
    try:
        d = float(days)
    except Exception:
        return None, "food:invalid"
    # <=2 days -> 1 (critical), >=14 days -> 0
    score = _lin_scale(d, 14.0, 2.0)  # invert via swapped bounds
    return score, f"food_days:{d:.1f}->{score:.2f}"


def _water_score(row: Dict[str, Any]) -> Tuple[float, str]:
    lpd = row.get("water_lpd")
    if lpd is None:
        return None, "water:missing"
    try:
        w = float(lpd)
    except Exception:
        return None, "water:invalid"
    # Sphere standard ~15 LPD; <=7.5 -> 1, >=15 -> 0
    score = _lin_scale(w, 15.0, 7.5)  # invert via swapped bounds
    return score, f"water_lpd:{w:.1f}->{score:.2f}"


def _health_score(row: Dict[str, Any]) -> Tuple[float, str]:
    sev = row.get("health_severity_0_1")
    if sev is not None:
        try:
            s = _clamp01(float(sev))
            return s, f"health_severity:{s:.2f}"
        except Exception:
            pass
    inc = row.get("disease_incidence_per_1k")
    if inc is None:
        return None, "health:missing"
    try:
        i = float(inc)
    except Exception:
        return None, "health:invalid"
    # <=5/1k -> 0, >=50/1k -> 1
    score = _lin_scale(i, 5.0, 50.0)
    return score, f"incidence_per_1k:{i:.1f}->{score:.2f}"


def _weather_score(row: Dict[str, Any]) -> Tuple[float, str]:
    sev = row.get("weather_severity_0_1")
    if sev is not None:
        try:
            s = _clamp01(float(sev))
            return s, f"weather_severity:{s:.2f}"
        except Exception:
            pass
    flag = row.get("disaster_flag")
    if flag is None:
        return None, "weather:missing"
    # Interpret truthy as 0.7 by default
    is_disaster = str(flag).lower() in ("1", "true", "yes", "y", "t")
    score = 0.7 if is_disaster else 0.0
    return score, f"disaster_flag:{bool(is_disaster)}->{score:.2f}"


def _movement_score(row: Dict[str, Any]) -> Tuple[float, str]:
    influx = row.get("influx_percent_7d")
    if influx is None:
        return None, "movement:missing"
    try:
        p = float(influx)
    except Exception:
        return None, "movement:invalid"
    # <=0% -> 0, >=50% -> 1
    score = _lin_scale(p, 0.0, 50.0)
    return score, f"influx_7d:{p:.1f}%->{score:.2f}"


_WEIGHTS = {
    "density": 0.2,
    "food": 0.25,
    "water": 0.2,
    "health": 0.15,
    "weather": 0.1,
    "movement": 0.1,
}


def compute_aid_score(row: Dict[str, Any]) -> Dict[str, Any]:
    """
    Compute Refugee Aid Score in [0,1] using available signals from row.
    Returns a dict with fields:
      - refugee_aid_score
      - details: per-signal scores
      - contributions: weighted contributions per signal actually used
      - notes: list of strings about missing/invalid inputs
    """
    signals = {
        "density": _density_score(row),
        "food": _food_score(row),
        "water": _water_score(row),
        "health": _health_score(row),
        "weather": _weather_score(row),
        "movement": _movement_score(row),
    }

    details: Dict[str, float] = {}
    notes: List[str] = []
    present: Dict[str, float] = {}

    for k, (val, note) in signals.items():
        if val is None:
            notes.append(note)
        else:
            details[k] = float(val)
            present[k] = float(val)

    if not present:
        return {
            "refugee_aid_score": 0.0,
            "details": details,
            "contributions": {},
            "notes": notes + ["no_valid_signals"],
        }

    # Renormalize weights over present signals
    weight_sum = sum(_WEIGHTS[k] for k in present.keys())
    contributions: Dict[str, float] = {}
    score = 0.0
    if weight_sum == 0:
        # fallback: equal weights
        w = 1.0 / len(present)
        for k, v in present.items():
            contrib = w * v
            contributions[k] = contrib
            score += contrib
    else:
        for k, v in present.items():
            wk = _WEIGHTS[k] / weight_sum
            contrib = wk * v
            contributions[k] = contrib
            score += contrib

    # Interaction uplift if both food and water are severe
    if "food" in present and "water" in present:
        if present["food"] > 0.8 and present["water"] > 0.8:
            score = min(1.0, score + 0.05)
            notes.append("uplift:food&water_critical")

    return {
        "refugee_aid_score": _clamp01(score),
        "details": details,
        "contributions": contributions,
        "notes": notes,
    }


def batch_score(rows: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    out: List[Dict[str, Any]] = []
    for row in rows:
        res = compute_aid_score(row)
        enriched = dict(row)
        enriched.update(res)
        out.append(enriched)
    return out
