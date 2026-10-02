# ProductPulse

Product evaluation workspace focused on **evidence, not confident-looking guesses**.

**Current version:** v0.2.0 — Evidence-based Evaluation

## Evaluation rules

ProductPulse does not preload fictional products or customer reviews.

A product score is calculated from validation evidence such as:
- customer interviews and problem confirmation
- solution tests and observed outcomes
- pricing tests and actual price acceptance
- paying and repeat customers
- competitive comparisons and win signals
- acquisition experiments and repeatable channels
- gross margin and differentiation evidence

Long descriptions, filled fields, product stage, or AI wording do **not** directly increase the product score.

If evidence is weak, the product is shown as **Chưa đủ dữ liệu** instead of being given an authoritative-looking score.

## AI boundary

Gemini can suggest risks and validation actions. It cannot:
- set or modify the evaluation score
- invent TAM/SAM/SOM or market statistics
- create fake reviews/testimonials
- manufacture validation evidence

## Local data

Products are stored locally in the browser. v0.2.0 uses a new storage namespace and removes the old seeded-data namespace.

## Development

```bash
npm install
npm run lint
npm run build
npm run dev
```

See [ROADMAP.md](./ROADMAP.md).
