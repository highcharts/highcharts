---
name: highcharts-maps
description: Highcharts Maps GeoJSON, TopoJSON, mapView, projections, map series, tiledwebmap, tilemap, flowmap, color axis, and map navigation from the bundled docs.
---

# Highcharts Maps

Use this for Highcharts Maps work: map series, mappoint, mapline, mapbubble, flowmap, tilemap, geoheatmap, tiled web map, projections, GeoJSON/TopoJSON, color axis, and map navigation.

## Workflow

1. Use `references/docs/index.md` to find guides for the requested Maps feature.
2. Read the smallest set covering the implementation; consult additional articles as needed. For modern longitude/latitude coordinates, projections, and conversions, start with `references/docs/maps/mapview-and-projection.md`. Use `references/docs/maps/latlon.md` for legacy proj4-based maps.
3. Use local TypeScript declarations or the API reference only for exact signatures and options not covered by the docs.
4. Prefer documented declarative options over imperative runtime mutation, except where the docs require runtime APIs.

## Boundaries

- Configure routine shared chart options, such as titles, backgrounds, and basic series styling, directly. For substantial work in core chart behavior, use `highcharts-js` when installed; for detailed accessibility or exporting work, use the matching companion skill when installed. Otherwise, consult installed declarations or the official API reference.
- For Stock, Gantt, React wrapper work, or Morningstar, use the `highcharts-stock`, `highcharts-gantt`, `highcharts-react`, or `highcharts-morningstar` skill.
- For Dashboards or Grid, consult `docs/<area>/` directly or the live docs.

## References

- Live docs: https://www.highcharts.com/docs/maps/
- API reference: https://api.highcharts.com/highmaps/
