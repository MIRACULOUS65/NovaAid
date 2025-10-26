from __future__ import annotations

import argparse
import csv
import json
import sys
from typing import Any, Dict, List

from .model import batch_score, SCHEMA_FIELDS


def _read_json(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if isinstance(data, dict):
        # support {"items": [...]} or single record
        if "items" in data and isinstance(data["items"], list):
            return [dict(x) for x in data["items"]]
        return [dict(data)]
    if isinstance(data, list):
        return [dict(x) for x in data]
    raise ValueError("Unsupported JSON structure: expected list or object")


def _write_json(path: str | None, rows: List[Dict[str, Any]]) -> None:
    out = rows
    text = json.dumps(out, ensure_ascii=False, indent=2)
    if path:
        with open(path, "w", encoding="utf-8") as f:
            f.write(text)
    else:
        sys.stdout.write(text + "\n")


def _read_csv(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        return [dict(row) for row in reader]


def _write_csv(path: str | None, rows: List[Dict[str, Any]]) -> None:
    if not rows:
        header = []
    else:
        # union of keys
        keys: List[str] = []
        seen = set()
        for r in rows:
            for k in r.keys():
                if k not in seen:
                    seen.add(k)
                    keys.append(k)
        header = keys

    if path:
        out = open(path, "w", encoding="utf-8", newline="")
    else:
        out = sys.stdout
    try:
        writer = csv.DictWriter(out, fieldnames=header)
        writer.writeheader()
        for r in rows:
            writer.writerow(r)
    finally:
        if out is not sys.stdout:
            out.close()


def main(argv: List[str] | None = None) -> int:
    p = argparse.ArgumentParser(
        description="Compute Refugee Aid Score (0-1) from CSV/JSON inputs."
    )
    p.add_argument("input", help="Path to input file (CSV or JSON)")
    p.add_argument(
        "-o",
        "--output",
        help="Output file path. If omitted, prints to stdout.",
        default=None,
    )
    p.add_argument(
        "--fmt",
        choices=["csv", "json"],
        help="Output format. Defaults to same as input.",
        default=None,
    )
    p.add_argument(
        "--show-schema",
        action="store_true",
        help="Print expected input fields and exit.",
    )

    args = p.parse_args(argv)

    if args.show_schema:
        sys.stdout.write("Expected fields (any subset acceptable):\n")
        for f in SCHEMA_FIELDS:
            sys.stdout.write(f"- {f}\n")
        return 0

    in_path: str = args.input
    lower = in_path.lower()
    if lower.endswith(".json"):
        rows = _read_json(in_path)
        out_rows = batch_score(rows)
        out_fmt = args.fmt or "json"
        if out_fmt == "json":
            _write_json(args.output, out_rows)
        else:
            _write_csv(args.output, out_rows)
    elif lower.endswith(".csv"):
        rows = _read_csv(in_path)
        out_rows = batch_score(rows)
        out_fmt = args.fmt or "csv"
        if out_fmt == "csv":
            _write_csv(args.output, out_rows)
        else:
            _write_json(args.output, out_rows)
    else:
        p.error("Input must be a .csv or .json file")
        return 2

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
