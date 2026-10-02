# ProductPulse

Product intelligence workspace that keeps **strategic analysis** separate from **real-world validation**.

**Current version:** v0.4.0 — Commercial & Operations

## Two score layers

### Analysis Score
Created outside the app (for example by ChatGPT) from product analysis, images, research, reasoning and sourced signals.

It can contain:
- arbitrary product metrics
- score + confidence per metric
- rationale
- observed / inferred / researched labels
- assumptions
- risks and opportunities
- next tests
- sources

### Validation Score
Calculated only from evidence entered into ProductPulse:
- customer interviews and problem confirmation
- solution tests and observed outcomes
- pricing tests and actual price acceptance
- paying and repeat customers
- competitive comparisons and win signals
- acquisition experiments and repeatable channels
- gross margin and differentiation evidence

Analysis never creates validation evidence automatically.

## Import a ChatGPT analysis file

Use a JSON file with:

```json
{
  "schema": "productpulse.analysis.v1"
}
```

ProductPulse auto-detects this format, creates a product, renders its Analysis dashboard, and leaves Validation at **Chưa đủ dữ liệu** until real evidence is added.

See:
- [ANALYSIS_IMPORT_SCHEMA.md](./ANALYSIS_IMPORT_SCHEMA.md)
- [example vintage frame file](./examples/vintage-memory-frame.productpulse.json)

The same import control still accepts ProductPulse backup arrays.

## Commercial & Operations

Each product can now track:
- customer price segment: low / mid / premium / luxury
- target age range
- Vietnam / international / both
- target countries/markets and sales channels
- self-production / outsourcing / imported finished goods / hybrid
- supplier country, MOQ and supplier lead time
- import cost, material cost, labor, packaging and other unit costs
- target selling price and platform fee
- calculated base unit cost, contribution, contribution margin and markup
- completion time, QC time and stock policy
- step-by-step operating workflow

Every commercial/operations section has a basis label: **unknown, hypothesis, quote, actual**. Hypotheses are never treated as validation evidence automatically.

## AI boundary inside the app

Gemini can suggest risks and validation actions. It cannot:
- set or modify Validation Score
- invent validation evidence
- create fake reviews/testimonials
- manufacture market statistics as facts

## Development

```bash
npm install
npm run lint
npm run build
npm run dev
```

See [ROADMAP.md](./ROADMAP.md).
