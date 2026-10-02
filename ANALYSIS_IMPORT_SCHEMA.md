# ProductPulse Analysis Import v1

Use this format when analysis is produced outside ProductPulse (for example by ChatGPT) and then imported into the app.

## Core rule

**Analysis is not validation.**

An imported analysis can contain strategic scores, research signals, assumptions and hypotheses. It must never create validation evidence such as paying customers, interviews, conversions or gross margin unless those values are separately provided as real evidence inside ProductPulse.

## File marker

```json
{
  "schema": "productpulse.analysis.v1"
}
```

## Product fields

- `name`: required
- `description`: required
- `tagline`: optional
- `category`: ProductPulse category
- `stage`: optional
- `pricingHypothesis`: hypothesis only
- `targetCustomerHypothesis`: hypothesis only
- `competitorsHypothesis`: hypothesis only

## Analysis fields

- `overallScore`: strategic analysis score, 0–100
- `confidence`: confidence in the analysis, 0–100
- `summary`: concise conclusion
- `metrics[]`: arbitrary metrics for the product
- `strengths[]`
- `risks[]`
- `assumptions[]`
- `opportunities[]`
- `nextTests[]`
- `sources[]`
- `generatedAt`
- `generatedBy`

Each metric contains:
- `key`
- `label`
- `score`
- `confidence`
- `weight` (optional)
- `rationale`
- `basis`: `observed`, `inferred`, or `researched`

If metric weights are supplied, ProductPulse recalculates Analysis Score from those weights so the file cannot contain an inconsistent headline score.

See `examples/vintage-memory-frame.productpulse.json`.
