# React Option Component Prop Contract

This document describes the checked-in contract used by the sample generator when extracting React option components.

## Source of truth

- Contract JSON: `tools/sample-generator/contracts/react-props.contract.json`
- Source package: `@highcharts/react`
- Source version: `5.0.1`

Type declaration origins:

- `options/Title.d.ts#TitleProps`
- `options/Legend.d.ts#LegendProps`
- `options/Tooltip.d.ts#TooltipProps`
- `options/XAxis.d.ts#XAxisProps`
- `options/YAxis.d.ts#YAxisProps`
- `Highcharts.d.ts#SeriesProps` (mapped type; generator uses an explicit safe prop subset)

## Deterministic test input policy

Tests read the checked-in JSON contract and **must not** fetch data from npm/network.

To refresh from local package typings:

```bash
node --import tsx tools/sample-generator/scripts/extract-react-prop-contract.ts
```

The script reads local files from:

1. `node_modules/@highcharts/react`
2. `tools/sample-generator/node_modules/@highcharts/react`

If neither exists, it exits with a clear error.

## Contract semantics

Each component entry includes:

- `directProps`: prop names that can be emitted directly on the JSX element.
- `allowOptionsFallback`: whether remainder can be represented in `options={...}`.
- `allOrNothing`: whether unsupported shape should keep the full block in `chartOptions`.

## Component policies

### Title

- direct props: all `TitleProps` fields from `options/Title.d.ts`
- `allowOptionsFallback`: `false`
- `allOrNothing`: `true`

### Legend

- direct props: scalar-safe subset extracted from `LegendProps`
- `allowOptionsFallback`: `false`
- `allOrNothing`: `false`

### Tooltip

- direct props: extracted from `TooltipProps`
- `allowOptionsFallback`: `true`
- `allOrNothing`: `false`

### XAxis / YAxis

- direct props: extracted from `XAxisProps` / `YAxisProps`
- `allowOptionsFallback`: `true`
- `allOrNothing`: `false`

### Series

- direct props: explicit safe subset
  - `id`, `index`, `name`, `type`, `className`, `color`, `events`, `data`, `options`
- `allowOptionsFallback`: `true`
- `allOrNothing`: `false`

## Notes

- Ordering is only contractual within repeated same-type components (especially `<Series>`).
- Cross-type child order is non-contractual.
- Path-driven legend samples are expected to support `<Title>`, `<Series>`, `<XAxis>`, `<Legend>` extraction for compatible shapes.
