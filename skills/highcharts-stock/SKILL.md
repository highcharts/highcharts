---
name: highcharts-stock
description: Highcharts Stock navigator, range selector, indicators, OHLC, candlestick, flags, data grouping, compare mode, and stock tools from the bundled docs.
---

# Highcharts Stock

Use this for Highcharts Stock work: candlestick, OHLC, HLC, flags, technical indicators, navigator, range selector, data grouping, compare mode, and stock tools.

## Workflow

1. Start with `references/docs/index.md` and select every entry that matches the requested Stock feature.
2. Read the selected docs before coding; the docs step is complete when every Stock feature, series type, or module you plan to use is covered by docs or named as an API/declaration lookup.
3. Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.
4. Prefer documented declarative options over imperative runtime mutation, except where the docs require runtime APIs.

## Boundaries

- For core Highcharts JS concepts such as axes, series, styling, accessibility, exporting, and non-Stock chart setup, use the `highcharts-js` skill.
- For Morningstar data connectors, use the `highcharts-morningstar` skill.
- For Maps, Gantt, or React wrapper work, use the `highcharts-maps`, `highcharts-gantt`, or `highcharts-react` skill.

## References

- Live docs: https://www.highcharts.com/docs/stock/
- API reference: https://api.highcharts.com/highstock/
