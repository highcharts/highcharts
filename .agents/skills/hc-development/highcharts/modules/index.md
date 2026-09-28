# Modules

Everything outside core: each module is a master in `ts/masters/modules/` that composes onto core classes.

## Products and big modules

| Area | Bundles | Read |
|---|---|---|
| Stock | `modules/stock`, `navigator`, `stock-tools`, `indicators/*`, `drag-panes`, `price-indicator` | [stock.md](stock.md) |
| Maps | `modules/map`, `heatmap`, `coloraxis`, `tilemap`, `tiledwebmap`, `flowmap`, `geoheatmap` | [maps.md](maps.md) |
| Gantt | `modules/gantt`, `xrange`, `pathfinder`, `grid-axis`, `treegrid`, `static-scale`, `current-date-indicator` | [gantt.md](gantt.md) |
| Accessibility | `modules/accessibility` | [accessibility.md](accessibility.md) |
| Exporting | `exporting`, `export-data`, `offline-exporting`, `full-screen` | [exporting.md](exporting.md) |
| Boost | `boost`, `boost-canvas` | [boost.md](boost.md) |
| Drilldown, breadcrumbs | `drilldown` | [drilldown.md](drilldown.md) |
| Annotations | `annotations`, `annotations-advanced` | [annotations.md](annotations.md) |
| Series types, more, 3D | `highcharts-more`, `highcharts-3d`, one module per family | [../series/index.md](../series/index.md) |
| Everything else | data, sonification, marker clusters, draggable points, series label, pattern fill, no-data, and more | [extensions.md](extensions.md) |

## Rules for all modules

- Guard `compose` with `pushUnique(composed, 'Name')`. Unguarded modules (data-sorting, data) duplicate handlers if loaded twice.
- Load order matters: modules that patch series types (boost, drilldown, draggable-points, export-data, marker-clusters) patch only types loaded before them. `exporting` loads before `export-data`, `offline-exporting`, `sonification`; `boost-canvas` before `boost`.
- QUnit tests load every module in `test/karma-files.json` order, so they miss load-order and missing-module bugs.
- Module defaults: `setOptions(XDefaults)` in `compose`. Option types: `declare module '../../Core/Options'`. Autoload mapping comes from `@requires modules/x` doclets (`npx gulp dependency-mapping`).
- Export copies the chart from options, so mirror runtime-only state into options. Code that must not run in the copy checks `renderer.forExport`.
- Static state is per bundle copy (e.g. `Annotation.types`, class-level listeners on `Breadcrumbs`); don't rely on module identity.
