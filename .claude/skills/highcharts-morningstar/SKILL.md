---
name: highcharts-morningstar
description: Highcharts Morningstar standard and DWS connectors, InvestmentsConnector, time series, screeners, risk, goal analysis, x-ray, security compare, and regulatory news from the bundled docs.
---

# Highcharts Morningstar Connectors

Use this for Morningstar connector work: standard and DWS variants, InvestmentsConnector, time series, screeners, risk score, goal analysis, x-ray, security compare, and regulatory news.

## Workflow

1. Start with `references/docs/index.md` and `references/docs/morningstar/morningstar.md` to choose the standard or DWS connector type.
2. Read every selected connector doc before coding; the docs step is complete when the connector variant, constructor options, load call, and table mapping you plan to use are covered by docs or named as an API/declaration lookup.
3. If the request mentions DWS, Direct Web Services, or InvestmentsConnector, read `references/docs/morningstar/dws-connector.md` after the overview.
4. Follow the connector constructor → load → table-mapping pattern shown in the docs.

## Boundaries

- For core Highcharts JS concepts such as axes, series, styling, accessibility, exporting, and non-connector chart setup, use the `highcharts-js` skill.
- For Highcharts Stock chart types such as candlestick, OHLC, navigator, indicators, and data grouping, use the `highcharts-stock` skill.
- For Maps, Gantt, or React wrapper work, use the `highcharts-maps`, `highcharts-gantt`, or `highcharts-react` skill.

## References

- Live docs: https://www.highcharts.com/docs/morningstar/
