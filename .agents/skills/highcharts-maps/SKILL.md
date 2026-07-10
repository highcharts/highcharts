---
name: highcharts-maps
description: Highcharts Maps GeoJSON, TopoJSON, mapView, projections, map series, tiledwebmap, tilemap, flowmap, color axis, and map navigation from the bundled docs.
---

# Highcharts Maps

Use this for Highcharts Maps work: map series, mappoint, mapline, mapbubble, flowmap, tilemap, geoheatmap, tiled web map, projections, GeoJSON/TopoJSON, color axis, and map navigation.

## Workflow

1. Start with `references/docs/index.md` and select every entry that matches the requested Maps feature.
2. Read the selected docs before coding; the docs step is complete when every map source, projection, series type, or navigation feature you plan to use is covered by docs or named as an API/declaration lookup.
3. Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.
4. Prefer documented declarative options over imperative runtime mutation, except where the docs require runtime APIs.

## Boundaries

- For core Highcharts JS concepts such as axes, series, styling, accessibility, exporting, and non-map chart setup, use the `highcharts-js` skill.
- For Stock, Gantt, React wrapper work, or Morningstar, use the `highcharts-stock`, `highcharts-gantt`, `highcharts-react`, or `highcharts-morningstar` skill.
- For Dashboards or Grid, consult `docs/<area>/` directly or the live docs.

## References

- Live docs: https://www.highcharts.com/docs/maps/
- API reference: https://api.highcharts.com/highmaps/
