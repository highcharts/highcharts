# Other modules

Paths relative to `ts/Extensions/`.

| Module | Entry | Hooks | Notes |
|---|---|---|---|
| `data` | `Data.ts` | Chart `init` (cancels, re-inits after parsing), Axis `afterSetType` | CSV, HTML table, Google Sheets, polling; listeners added at import, no guard |
| `data-tools` | `ts/Data/*` | – | DataTable, connectors, modifiers. See [../../shared.md](../../shared.md) |
| `data-sorting` | `DataSorting/DataSortingComposition.ts` | wraps `Series.setData`; Chart `beforeRender`, `afterLinkSeries` | no guard |
| `debugger` | `Debugger/Debugger.ts` | H `displayError` | |
| `draggable-points` | `DraggablePoints/DraggablePoints.ts` | Point `mouseOver`, `mouseOut`; Chart `render` | per-type `dragDropProps` in `DragDropProps.ts` |
| `marker-clusters` | `MarkerClusters/MarkerClusters.ts` | Axis `setExtremes`, Series `afterRender`; replaces scatter `generatePoints` | `plotOptions.scatter.cluster` |
| `no-data-to-display` | `NoDataToDisplay/NoDataToDisplay.ts` | Chart `render` | |
| `non-cartesian-zoom` | `NonCartesianSeriesZoom/NonCartesianSeriesZoom.ts` | Chart `transform`, `afterSetChartSize`; Series `getPlotBox`; Tooltip `getAnchor` | |
| `parallel-coordinates` | `ParallelCoordinates/*` | Chart `init`; Axis `getSeriesExtremes` | |
| `pattern-fill` | `PatternFill.ts` | SVGRenderer `complexColor`; wraps `Series.getColor` | also used by pictorial |
| `series-label` | `SeriesLabel/SeriesLabel.ts` | Chart `load`, `redraw` | skips boosted series |
| `sonification` | `Sonification/Sonification.ts` | Chart `render`, `update` | every chart gets an AudioContext and timeline once loaded |
| `textpath` | `TextPath.ts` | SVGElement `afterGetBBox`, `beforeAddingDataLabel` | also composed by 8 series types |
| `static-scale`, `current-date-indicator`, `arrow-symbols` | see [gantt.md](gantt.md) | | |
| `mouse-wheel-zoom`, `price-indicator`, `drag-panes` | see [stock.md](stock.md) | | |
| `highcharts-more` Pane | `Pane/*` | Chart `afterIsInsidePlot`; Pointer hover data | panes are created by `PolarComposition` and `RadialAxis` |
| `themes/*` | `Themes/*.ts` | `setOptions` | |
| `highcharts-autoload` | `Autoload/Loader.ts` | replaces chart factories | |

In core despite the folder: `BorderRadius.ts` and `ScrollablePlotArea.ts`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| CSV, table or Sheets parsing | `Data::parseCSV`, `parseColumn`, `parseDate`, `parseTypes` | `ts/Data/Converters/*` |
| Series mapping; axis after update or polling | `Data` `SeriesBuilder`, `complete`, `update`, `xAxisUpdateHandler` | |
| Marker clusters hang or overlap | `MarkerClusterScatter` grid and collision code | |
| Non-cartesian zoom | `NonCartesianSeriesZoom::onTransform`, `onAfterSetChartSize` | `DataLabel.ts` |
| Pattern fill | `PatternFill::createPatterns`, `onRendererComplexColor` | |
| Series label position | `SeriesLabel::getPointsOnGraph` | |
| Pane or solid gauge clip, hover | `Pane/PaneComposition.ts` | `Series/PolarComposition.ts` |
| Sonification mapping, playback | `Sonification/TimelineFromChart.ts`, `SonificationTimeline.ts` | |
| Draggable points for a type | `DragDropProps.ts` | `DraggablePoints` `compose` lists |

## Gotchas

- CSV/HTML/Sheets parsing exists twice: `Extensions/Data.ts` (charts) and `ts/Data/Converters/*` (data-tools, Dashboards).
- Generated, don't hand-edit: `Debugger/ErrorMessages.ts` (from `errors/*/readme.md`), `Autoload/DependencyMapping.ts`.
