# Core overview

Core is the `highcharts.js` bundle (list in [../bundles.md](../bundles.md)): mostly `ts/Core/`, plus the 8 core series types in `ts/Series/`.

## Object model

```
Chart ─ renderer (SVGRenderer) ─ SVGElement tree
  ├─ axes[] = xAxis[] + yAxis[] (+ colorAxis[] from a module)
  │    └─ ticks, minorTicks, plotLinesAndBands, stacking.stacks
  ├─ series[] ─ points[] (Point), dataTable (DataTableCore)
  ├─ legend (Legend)      created on Chart 'beforeMargins'
  ├─ pointer (Pointer)    created on Chart 'beforeRender'
  │    └─ chart.tooltip   created on Pointer 'afterInit'
  ├─ time (Time), options, userOptions
  └─ title, subtitle, caption, credits (SVGElements)
```

Core parts also compose: `ts/masters/highcharts.src.ts` calls `Legend.compose`, `Pointer.compose`, `Tooltip.compose`, `DataLabel.compose`, `StackingAxis.compose`, `PlotLineOrBand.compose`, `Responsive.compose`, `ScrollablePlotArea.compose` and others.

## Lifecycle

- Create: `Chart.init` → `firstRender`: `getContainer`, `resetMargins`, `setChartSize`, `propFromSeries`, `createAxes`, `initSeries` per series, `linkSeries`, fire `beforeRender`, `render`, `onload` (fires `load`, `render`).
- `Chart.render`: fires `beforeMargins`, `getStacks`, `getMargins` (axis offsets, legend, titles), `setChartSize`, axis `setScale` (then `setTickInterval(true)` while the plot size changes), `drawChartBox`, axis `render`, `renderSeries`, `addCredits`, `setResponsive`.
- Update: `setData`, `addPoint`, `update`, `setExtremes` etc. set dirty flags (`isDirty`, `isDirtyData`, `isDirtyBox`, `isDirtyLegend`) and call `chart.redraw()` unless the `redraw` argument is `false`.
- `Chart.redraw`: fires `beforeRedraw`; legend if dirty; `getStacks`; axis `updateNames` + `setScale`; `getMargins`; axis `redraw` if the box is dirty or any series stacks; `drawChartBox`; fires `predraw`; dirty series `redraw` (= `translate` + `render`); `pointer.reset`; fires `redraw`, `render`; then deferred axis `afterSetExtremes`.
- Series render: `plotGroup`, `setClip`, `animate(true)`, `drawGraph` + `applyZones`, `drawPoints`, `drawDataLabels`, `drawTracker`, `animate()`.

## Subsystems

| Area | Main files | Read |
|---|---|---|
| Chart, options, responsive | `Chart/Chart.ts`, `Chart/ChartDefaults.ts`, `Defaults.ts`, `Responsive.ts`, `Extensions/ScrollablePlotArea.ts` | [chart.md](chart.md) |
| Pointer, tooltip, legend | `Pointer.ts`, `Tooltip.ts`, `Legend/*` | [interaction.md](interaction.md) |
| Axis | `Axis/Axis.ts`, `Axis/Tick.ts`, `Axis/{DateTime,Logarithmic}Axis.ts`, `Axis/Stacking/*`, `Axis/PlotLineOrBand/*` | [axis.md](axis.md) |
| Series, point, core types | `Series/Series.ts`, `Series/Point.ts`, `ts/Series/{Line,Area,Column,Pie,…}`, `Data/DataTableCore.ts` | [series.md](series.md) |
| Data labels | `Series/DataLabel.ts`, `Series/OverlappingDataLabels.ts`, `ColumnDataLabel.ts`, `PieDataLabel.ts` | [data-labels.md](data-labels.md) |
| Renderer, text, animation, color, format, time | `Renderer/**`, `Animation/*`, `Color/*`, `Templating.ts`, `Time.ts`, `Shared/TimeBase.ts` | [renderer.md](renderer.md) |
| Utilities, globals | `Shared/Utilities.ts`, `Utilities.ts`, `Globals.ts` | [../patterns.md](../patterns.md) |

## Module coupling in core

Core checks module state in places: `polar` in Chart, Axis and Tooltip; `ordinal` in Axis; `navigator` and `boost` flags in Chart, Series and Pointer. Don't add more; add a hook and move the logic to the module.
