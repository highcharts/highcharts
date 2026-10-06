# Highcharts Gantt

`highcharts-gantt` = core + `modules/gantt`. Nothing here is in core. Each piece also ships alone: `xrange`, `pathfinder`, `grid-axis`, `treegrid`, `static-scale`, `current-date-indicator`.

## Files

- `Core/Chart/GanttChart.ts`: `ganttChart()`, `init` defaults: grid datetime x axes (a second one linked), `treegrid` y axis unless `categories`, `staticScale: 50`, legend off.
- `Series/XRange/*`: bars from `x` to `x2`, `partialFill`, `x2` in axis extremes. Base of `Series/Gantt/*` (`start`, `end`, `completed` aliases, milestones).
- `Core/Axis/GridAxis.ts`: `grid` option, cell labels, borders, `grid.columns`.
- `Core/Axis/TreeGrid/*` + `Gantt/Tree.ts` + `Series/TreeUtilities.ts`: `treegrid` axis type; builds the tree from `id`/`parent`; collapse and expand through `BrokenAxis` breaks.
- `Gantt/Pathfinder.ts`, `Connection.ts`, `PathfinderAlgorithms.ts` (`straight`, `simpleConnect`, `fastAvoid`), `PathfinderComposition.ts`, `ConnectorsDefaults.ts`: dependency connectors on any chart.
- `Extensions/StaticScale.ts` (pixels per unit → chart height), `CurrentDateIndication.ts`, `ArrowSymbols.ts`.
- Navigator, range selector and scrollbar come from Stock (opt-in).
- `Gantt/Legacy.ts` is dead code.

## Flows

- Init: `ganttChart()` → `GanttChart.init` → axis init runs TreeGrid `wrapInit` and GridAxis hooks → `GanttPoint.applyOptions` maps start/end/completed.
- Layout: chart `beforeRender`/`beforeRedraw` → TreeGrid `onBeforeRender` (rebuild tree, categories, `series.setData`) → `setTickInterval` wrap → collapsed nodes become breaks → GridAxis label and render hooks → XRange `translatePoint`, `drawPoint` → chart `render` → `adjustHeight` (static scale).
- Connectors: `Chart.prototype.callbacks` → `new Pathfinder` → `new Connection` per `dependency` → after series `afterAnimate`: `Connection.render` → `algorithms[type]` → path and markers.
- Collapse: label click → `Tick.toggleCollapse` → `treeGrid.toggleCollapse` → `brokenAxis.setBreaks` → redraw.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Grid cell labels, secondary datetime ticks | `GridAxis` `onAfterSetOptions`, `onTrimTicks`, `onAfterRender` | core `Axis.ts` |
| `grid.columns`; crash on late load or destroy | `GridAxis` `onAfterInit`, `wrapGetOffset`, `onDestroy` | |
| Rows, parents, `uniqueNames` | `TreeGridAxis::getTreeGridFromData`, `onBeforeRender` | `Gantt/Tree.ts` |
| Collapse, expand, icons | `TreeGridAxis::collapse`, `TreeGridTick::toggleCollapse` | `BrokenAxis`, `ScrollbarAxis`, `StaticScale` |
| start, end, milestone, completed | `GanttPoint::setGanttPointAliases`, `GanttSeries::drawPoint` | `XRangeSeries` extremes |
| Bar geometry, partial fill, labels | `XRangeSeries::translatePoint`, `drawPoint`, `alignDataLabel` | core `cropData`, `ColumnSeries` |
| Connector routing or markers | `PathfinderAlgorithms`, `Connection::getPath`, `render` | `Pathfinder::update` |
| Chart height with staticScale | `StaticScale::chartAdjustHeight` | |
| Drag handles | `DraggablePoints`, `DragDropProps.ts` | |

Tests: `samples/unit-tests/{gantt,series-xrange}/`.

## Core vs module

Use the smallest module that owns the concept: grid → `GridAxis`, tree → `TreeGridAxis`, bars → `XRange`, connectors → `Pathfinder`. `GanttChart.init` and `GanttSeriesDefaults` hold product defaults only.

## Gotchas

- TreeGrid owns y values: its `series.setData` overwrites user `y`. `uniqueNames` defaults to false on treegrid.
- XRange and Gantt `point.graphic` is a group with `.rect` and `.partRect`; milestones are a diamond path.
- `grid.columns[1..]` are internal axes removed from `chart.axes`; GridAxis forwards `getOffset`, `setScale`, `render` and `destroy` to them.
- Pathfinder rebuilds all connections and obstacles on every redraw.
- Gantt series reads its base class from `SeriesRegistry.seriesTypes`, so xrange must load first.
