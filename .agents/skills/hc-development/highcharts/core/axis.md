# Axis

## Files

Core:

- `Core/Axis/Axis.ts`: extremes, ticks, translation, layout, crosshair, categories, `setExtremes`, `update`.
- `Core/Axis/AxisDefaults.ts`: `xAxis` and `yAxis` defaults and doclets, merged into `defaultOptions` by `Axis.ts`. Types in `AxisOptions.ts`.
- `Core/Axis/Tick.ts`: label format and create, position, overflow, grid line, mark.
- `Core/Axis/DateTimeAxis.ts` (`axis.dateTime`), `LogarithmicAxis.ts` (`axis.logarithmic`), with tick math in `Core/Time.ts::getTimeTicks` and `Shared/TimeBase.ts`.
- `Core/Axis/PlotLineOrBand/*`: plot lines and bands, labels, `addPlotBand`/`removePlotLine`.
- `Core/Axis/Stacking/StackingAxis.ts` (`axis.stacking`, `chart.getStacks`, series `setStackedPoints`, `percentStacker`, `setGroupedPoints`) and `StackItem.ts` (stack labels).

Modules: `OrdinalAxis` (stock), `BrokenAxis` (broken-axis, stock, gantt), `GridAxis` and `TreeGrid/*` (gantt, grid-axis, treegrid), `RadialAxis` and `WaterfallAxis` (more), `Color/*` (coloraxis, heatmap, map), `SolidGaugeAxis` (solid-gauge), `Axis3DComposition`, `Tick3DComposition`, `ZAxis` (3d), `ScrollbarAxis` and `NavigatorAxisComposition` (stock, navigator, gantt, a11y), `Extensions/ParallelCoordinates/ParallelAxis.ts`.

## Flows

- Init: `Chart.createAxes` → `new Axis` → `init`: fires `init`; `setOptions` merges side defaults, `defaultOptions[coll]` and user options, fires `afterSetOptions`; sets type, fires `afterSetType` (creates `dateTime` or `logarithmic`); inserts into `chart.axes`; fires `afterInit`. Chart then fires `afterCreateAxes` (creates color and z axes).
- `setScale` (from `Chart.redraw` and `Chart.render`): `setAxisSize`; skip unless something is dirty; y axes `buildStacks`; `getSeriesExtremes` (fires `getSeriesExtremes`, `afterGetSeriesExtremes`); `setTickInterval`; fires `afterSetScale`.
- `setTickInterval`: min/max from `userMin`, `options.min`, threshold or data (linked axes take the parent's); fires `foundExtremes`; `adjustForMinRange`; soft min/max, padding, floor/ceiling; tick interval; x axes run `series.processData()` and fire `postProcessData`; `setAxisTranslation`; `unsquish`; `setTickPositions`.
- `setTickPositions`: `tickPositions` option, else datetime (`getTimeTicks`), log (`getLogTickPositions`) or linear (`getLinearTickPositions`); `tickPositioner`; `trimTicks` (start/endOnTick, fires `trimTicks`); `adjustTickAmount`; fires `afterSetTickPositions`.
- Translation: `setAxisTranslation` sets `pointRange`, `minPointOffset`, `transA`, `minPixelPadding`. `translate`/`toPixels`/`toValue` use `linkedParent || this` and call `val2lin`/`lin2val` for ordinal, breaks or log.
- Layout in `Chart.render`: up to `chart.axisLayoutRuns` (2) passes: `setScale` → `getAxisMargins` (`getOffset` per axis), then `setTickInterval(true)` on axes whose plot size changed → `getMargins`. `Chart.redraw` does one pass.
- `getOffset`: creates ticks (`Tick` fires `init`, `labelFormat`), `renderUnsquish` (rotation, ellipsis), title, line, offsets; fires `afterGetOffset`.
- `render`: ticks (`Tick.render` → grid line, mark, label), alternate bands, plot lines/bands, line, title, `renderStackTotals`, `saveOld`; fires `afterRender`.
- Extremes: `setExtremes` fires `setExtremes`; default action sets `userMin`/`userMax` and redraws; `afterSetExtremes` fires after redraw. Zoom and pan go through `Chart.transform`, which sets `axis.isPanning`.
- `update()` merges `userOptions` and re-runs `init()` on the same instance.
- Stacks: `chart.getStacks` → `setStackedPoints` → `modifyStacks` → `Series.getExtremes` uses `stackedYData` → `Series.translate` sets `stackY`/`yBottom` and calls `StackItem.setOffset` → `renderStackTotals`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Wrong min/max, padding, soft min/max, floor/ceiling | `Axis::setTickInterval` | `adjustForMinRange`, `Series::getExtremes` |
| Zoom limit, minRange | `Axis::adjustForMinRange`, `setScale` | `Chart::transform` |
| tickAmount, alignTicks, alignThresholds | `Axis::adjustTickAmount`, `getThresholdAlignment` | `alignToOthers` |
| Edge ticks, start/endOnTick | `Axis::trimTicks` | `GridAxis` `onTrimTicks` |
| Column padding, pointRange, closestPointRange | `Axis::setAxisTranslation`, `getClosest` | `Series::applyZones` |
| Category names, x positions | `Axis::nameToX`, `updateNames` | `Series::getColumn`, `getX` |
| Datetime ticks, DST | `Time::getTimeTicks`, `TimeBase::makeTime` | `DateTimeAxis` `normalizeTimeTickInterval` |
| Datetime label format | `Tick::addLabel` | `TimeBase::getDateFormat`; `dateTimeLabelFormats` in 3 defaults files |
| Label rotation, ellipsis, wrap | `Axis::unsquish`, `renderUnsquish`, `getSlotWidth`; `Tick::createLabel`, `handleOverflow` | `HTMLElement.ts` for `useHTML` |
| Title or labels clipped, offsets | `Axis::getOffset`, `getTitlePosition`; `Tick::getLabelPosition` | `Chart::getAxisMargins` |
| Differs after render vs redraw | `Chart::render` layout loop | `setTickInterval(secondPass)` |
| Plot line/band path or label | `PlotLineOrBand::render`, `renderLabel` | `getPlotBandPath`; radial and 3D overrides |
| Stack label position | `StackItem::setOffset`, `getStackBox` | `Series::translate`; variwide, waterfall |
| Stack totals, percent, centerInCategory | `StackingAxis` `setStackedPoints`, `setGroupedPoints` | `ColumnSeries`, `WaterfallSeries` |
| Stock ordinal zoom, pan, gaps | `OrdinalAxis` | `Pointer`, `StandaloneNavigator` |
| Gantt grid columns and cells | `GridAxis` `onAfterInit`, `onAfterRender` | `TreeGridAxis`, `TreeGridTick` |
| Color axis marker or legend | `ColorAxis::getPlotLinePath`, `drawLegendSymbol` | `ColorAxisComposition` |
| Polar and gauge axes | `RadialAxis` | `RadialAxisDefaults`, `Pane` |

## Related code

- Series: `getExtremes`, `applyExtremes`, `getXExtremes`, `processData` (sets `closestPointRange`), `bindAxes`, `translate`.
- Chart: `createAxes`, `addAxis`, `render`, `redraw`, `getMargins`, `setChartSize`, `transform`, `pan`, `update` (matches axes by id, then index).
- Crosshair: `Pointer.runPointActions` → `Axis.drawCrosshair`; stock adds crosshair labels in `StockChart.ts`.
- Axis defaults per product: `StockChart.ts`, `GanttChart.ts`, `RadialAxisDefaults.ts`, `Axis3DDefaults.ts`, `ColorAxisDefaults.ts`.
- Maps: map series are not cartesian; `MapView` replaces axes, only the color axis is laid out.
- a11y axis descriptions: `Accessibility/Utils/ChartUtilities.ts`.
- Tests: `samples/unit-tests/axis/`, plus `broken-axis`, `coloraxis`, `gantt`, `polar`, `3d`, `time`, `stockchart`.

## Core vs module

Modules keep at most a one-line check in core: `brokenAxis?.hasBreaks`, `ordinal?.positions`, `grid?.isColumn`, `staticScale`, `isRadial`, `isZAxis`. Generic cartesian features (`crossing`, `alignThresholds`, `minorTicksPerMajor`) live in core. Product defaults stay in product files.

## Gotchas

- Log axes: `min`, `max`, `tickPositions` and `translate()` input are log values; convert with `logarithmic.log2lin`/`lin2log`.
- `update()` re-runs `init()`, so `init`/`afterInit` handlers must be idempotent. Ticks, names and plot lines persist.
- `chart.axes` includes color axes, z axes and internal navigator axes (`options.isInternal`); loops may need to skip them.
- Label spacing is decided twice: `unsquish` (interval, rotation) and `renderUnsquish` (measured widths).
- Test layout fixes with both `redraw()` and `setSize()`.
- start/endOnTick are ignored while panning. alignTicks is off if start/endOnTick is false, and on log axes.
- Stack labels are created hidden in `axis.render` and positioned from `Series.translate`, so placement fixes are often series-side.
