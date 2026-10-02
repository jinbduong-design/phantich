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

## Optional commercial fields

The same `productpulse.analysis.v1` file may include three optional sections:

### `market`
- `basis`: `unknown | hypothesis | quote | actual`
- `customerSegment`: `Thấp | Trung bình | Cao cấp | Luxury | Chưa xác định`
- `ageMin`, `ageMax`
- `marketScope`: `Việt Nam | Quốc tế | Cả hai | Chưa xác định`
- `targetMarkets[]`
- `channels[]`
- `notes`

### `economics`
- `currency`: `VND | USD`
- `basis`
- `importUnitCost`
- `materialCost`
- `laborCost`
- `packagingCost`
- `otherUnitCost`
- `platformFeePct`
- `targetSellingPrice`

ProductPulse calculates base unit cost, platform fee, contribution, contribution margin and markup. Imported cost/price numbers remain hypotheses unless their basis is set to quote or actual.

### `operations`
- `basis`
- `productionModel`: self-production / outsourcing / imported finished goods / hybrid
- `fulfillmentModel`: make-to-order / ready stock / hybrid
- `supplierCountry`
- `moq`
- `supplierLeadTimeDays`
- `completionTimeHours`
- `qcTimeMinutes`
- `stockPolicy`
- `steps[]`: name, owner, durationMinutes, note
- `notes`

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
