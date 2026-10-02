# ProductPulse

Product intelligence workspace that keeps **strategic analysis** separate from **real-world validation**.

**Current version:** v0.3.0 — External Analysis Import

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
