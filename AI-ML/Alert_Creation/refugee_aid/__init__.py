"""Refugee Aid Scoring package.

Provides a heuristic model to compute a 0–1 urgency score per camp/location.
"""

from .model import compute_aid_score, batch_score, SCHEMA_FIELDS  # noqa: F401
