# ProductPulse

Product evaluation workspace for turning product ideas into clearer decisions.

**Current version:** v0.1.0 — Product Intelligence Foundation

## What v0.1.0 changes

- Separates product **score** from **data confidence**.
- Stops default scoring from rewarding long descriptions or filled-in fields as if they were proof.
- Makes AI analysis conservative about missing evidence and unsupported market claims.
- Simplifies the main header, product cards and evaluation screen for desktop and mobile.
- Keeps local JSON import/export and the existing persona, SWOT, competitor, comparison and report flows.

## Development direction

See [ROADMAP.md](./ROADMAP.md) for the planned path from v0.2 UX Foundation to v1.0 Product Intelligence.

## Local development

```bash
npm install
npm run dev
```

Checks:

```bash
npm run lint
npm run build
```
