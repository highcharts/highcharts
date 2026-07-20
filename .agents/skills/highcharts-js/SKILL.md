---
name: highcharts-js
description: Highcharts JS options, axes, series, data, styling, accessibility, exporting, and modules from the bundled docs.
---

# Highcharts JS

Use this for Highcharts JS work: installation, chart setup, options, axes, series, data, styling, common chart types, accessibility overview, export basics, and selected advanced features.

## Workflow

1. Start with `references/docs/index.md` and select every entry that matches the requested Highcharts JS feature.
2. Read the selected docs before coding; the docs step is complete when every option, series type, or module you plan to use is covered by docs or named as an API/declaration lookup.
3. Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.
4. Prefer documented declarative options over imperative runtime mutation, except where the docs require runtime APIs.

## Boundaries

- For Stock, Maps, Gantt, React, or Morningstar, use the `highcharts-stock`, `highcharts-maps`, `highcharts-gantt`, `highcharts-react`, or `highcharts-morningstar` skill.
- For Dashboards, Grid, or Flutter, consult `docs/<area>/` directly or the live docs because no generated skill exists yet.

## References

- Live docs: https://www.highcharts.com/docs/
- API reference: https://api.highcharts.com/highcharts/
