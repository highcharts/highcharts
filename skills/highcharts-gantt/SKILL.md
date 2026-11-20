---
name: highcharts-gantt
description: Highcharts Gantt task configuration, dependencies, axis grid, grouping, milestones, and project schedule charts from the bundled docs.
---

# Highcharts Gantt

Use this for Highcharts Gantt work: task configuration, dependencies, axis grids, grouping tasks, milestones, and project schedule charts.

## Workflow

1. Start with `references/docs/index.md` and select every entry that matches the requested Gantt feature.
2. Read the selected docs before coding; the docs step is complete when every task option, dependency, grid, grouping, or milestone behavior you plan to use is covered by docs or named as an API/declaration lookup.
3. Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.
4. Prefer documented declarative options over imperative runtime mutation, except where the docs require runtime APIs.

## Boundaries

- For core Highcharts JS concepts such as axes, series, styling, accessibility, exporting, and non-Gantt chart setup, use the `highcharts-js` skill.
- For Stock, Maps, React wrapper work, or Morningstar, use the `highcharts-stock`, `highcharts-maps`, `highcharts-react`, or `highcharts-morningstar` skill.
- For Dashboards or Grid, consult `docs/<area>/` directly or the live docs.

## References

- Live docs: https://www.highcharts.com/docs/gantt/
- API reference: https://api.highcharts.com/gantt/
