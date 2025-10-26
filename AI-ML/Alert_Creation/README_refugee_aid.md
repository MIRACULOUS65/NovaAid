# Refugee Aid Scoring (Heuristic Model)

Compute a Refugee Aid Score (0–1) for locations/camps using multiple signals:
- Location & crowd density
- Food/water supply
- Health/disease reports
- Weather/disaster signals
- Movement trends

Higher score = more urgent need.

## Quickstart

No external dependencies (Python 3.9+). Two ways to run:

- As a module (recommended):
  ```bash
  python -m refugee_aid.cli examples/refugee_samples.csv --fmt csv
  ```
- Or target the script directly:
  ```bash
  python refugee_aid/cli.py examples/refugee_samples.json --fmt json
  ```

Outputs scored records with fields:
- `refugee_aid_score` in [0,1]
- `details` per-signal raw scores
- `contributions` weighted contributions
- `notes` about missing/invalid inputs or uplifts

## Input Schema (any subset acceptable)
Run to print schema:
```bash
python -m refugee_aid.cli dummy --show-schema
```
Expected fields (all optional, but more is better):
- `location_id` (string)
- `population` (int)
- `area_km2` (float)
- `crowd_density` (float)
- `food_supply_days` (float)
- `water_lpd` (float)
- `health_severity_0_1` (float, 0–1)
- `disease_incidence_per_1k` (float)
- `weather_severity_0_1` (float, 0–1)
- `disaster_flag` (bool/0-1/true/false)
- `influx_percent_7d` (float, e.g., 25 for +25%)

Notes:
- If `crowd_density` is missing but `population` and `area_km2` are present, density is computed.
- Missing signals are ignored; weights are re-normalized over present signals.

## CSV/JSON Formats
- CSV: header row with any subset of schema fields; values as strings are fine.
- JSON: either a list of objects `[ {...}, {...} ]` or `{ "items": [ ... ] }` or a single object.

## Examples
```bash
# CSV in -> CSV out (stdout)
python -m refugee_aid.cli examples/refugee_samples.csv --fmt csv

# CSV in -> JSON out (file)
python -m refugee_aid.cli examples/refugee_samples.csv --fmt json -o scored.json

# JSON in -> CSV out (stdout)
python -m refugee_aid.cli examples/refugee_samples.json --fmt csv
```

## Model Overview
Weighted heuristic with per-signal scores in [0,1]:
- Density: 0 at ≤500 ppl/km², 1 at ≥5000.
- Food: 1 at ≤2 days, 0 at ≥14 days.
- Water: 1 at ≤7.5 LPD, 0 at ≥15 LPD.
- Health: `health_severity_0_1` if provided, else from disease incidence (0 at ≤5/1k, 1 at ≥50/1k).
- Weather: `weather_severity_0_1` if provided, else `disaster_flag` → 0.7/0.0.
- Movement: 0 at ≤0% 7d influx, 1 at ≥50%.

Weights (renormalized if missing):
- density 0.20, food 0.25, water 0.20, health 0.15, weather 0.10, movement 0.10

Uplift: if both food and water > 0.8 (critical), add +0.05 (capped at 1.0).

## Caveats
- This is not a predictive ML model; it’s a transparent heuristic baseline.
- Adjust thresholds/weights per context and data quality.
- Validate against ground truth where available.
