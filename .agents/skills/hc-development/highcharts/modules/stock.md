# Highcharts Stock

`highstock` = core + `modules/stock`, which also pulls in `broken-axis`, `datagrouping` and `mouse-wheel-zoom`. No `ts/Stock/*` file is in core. Separate modules: `navigator`, `stock-tools`, `drag-panes`, `price-indicator`, `heikinashi`, `hollowcandlestick`, `renko`, `pointandfigure`, `indicators/*`, `standalone-navigator`.

## Files

- `Core/Chart/StockChart.ts`: `stockChart()`, `init` (stock defaults incl. `ordinal: true`, then user options, then forced x axis `type: 'datetime'`, no `categories`, and `startOnTick`/`endOnTick: false` with the navigator), `createAxis`, crosshair labels, plot lines across panes, `crispPolyLine`.
- `Stock/Navigator/Navigator.ts`: own internal axes and series, masks, handles, drag → `setRange`; owns `chart.scrollbar`; `stickToMax`. `ChartNavigatorComposition.ts` creates and places it. `Core/Axis/NavigatorAxisComposition.ts` (`toFixedRange`). `StandaloneNavigator.ts`: `Highcharts.navigator()`.
- `Stock/Scrollbar/Scrollbar.ts` (fires `changed`) and `Core/Axis/ScrollbarAxis.ts` (`xAxis.scrollbar`).
- `Stock/RangeSelector/RangeSelector.ts` (buttons, dropdown, date inputs, `clickButton`, `updateButtonStates`, layout) and `RangeSelectorComposition.ts` (chart hooks, calendar `minFromRange`).
- `Core/Axis/OrdinalAxis.ts`: gap-less x axis, `overscroll`, ordinal pan, `getTimeTicks`. `Core/Axis/BrokenAxis.ts`: `breaks`, `gapSize`.
- `Extensions/DataGrouping/*`: `DataGroupingAxisComposition.ts` (`applyGrouping`, `getGroupPixelWidth`), `DataGroupingSeriesComposition.ts` (`groupData`, anchors, per-type defaults), `ApproximationRegistry.ts`, `ApproximationDefaults.ts`, grouped tooltip header in `DataGrouping.ts`.
- `Series/DataModifyComposition.ts`: `compare` and `cumulative` via `series.dataModify`.
- Series: `HLC` → `OHLC` → `Candlestick` (+ `FinancialSymbols.ts`), `Flags` + `OnSeriesComposition.ts`, `HeikinAshi`, `HollowCandlestick`, `Renko`, `PointAndFigure`.
- `Extensions/MouseWheelZoom/`, `PriceIndication.ts` (`lastPrice`), `DragPanes/` (`yAxis.resize`).
- `Stock/Indicators/SMA/SMAIndicator.ts`: base of 35 indicators (EMA and LinearRegression are bases too); `MultipleLinesComposition.ts`.
- `Stock/StockTools/*` (bindings, toolbar GUI, utilities) on top of `Extensions/Annotations/NavigationBindings*.ts`.

## Flows

- Build: `stockChart()` → `StockChart.init` → `afterGetContainer` (range selector, stock tools GUI) → axes (`navigatorAxis`, `ordinal`, `scrollbar`, `brokenAxis`) → series (data grouping defaults, `dataModify`) → `afterLinkSeries` (indicators compute) → `beforeRender` (`new Navigator`) → render → `load`.
- Extremes: `setExtremes` → redraw → series `updatedData` (navigator series, ordinal index, indicators) → `setTickInterval` (`minFromRange`, `foundExtremes`: navigator and overscroll; `processData`) → `postProcessData` (data grouping) → `initialAxisTranslation` (ordinal positions) → margins (range selector, navigator, toolbar) → translate (ordinal `val2lin`, `dataModify`) → navigator and range selector render → `afterSetExtremes`.
- Navigator drag: handle or shade mousedown → mousemove `render` → mouseup → `setRange` → `xAxis.setExtremes({ trigger: 'navigator' })`. Scrollbar fires `changed` → navigator or axis `setExtremes`.
- Range button: `clickButton` → range by type (`month`/`year` via `minFromRange`, `ytd`, `all`, fixed units) → `setExtremes({ trigger: 'rangeSelectorButton' })` → `afterBtnClick`.
- Data grouping: `postProcessData` → group if rows exceed plot width / `groupPixelWidth` → `getTimeTicks` → `groupData` with the approximation → `dataTable.modified` → points get `dataGroup`.
- Indicators: `SMAIndicator.init` links to the parent → on parent `updatedData`: `recalculateValues` → `getValues` → `setData`.

## Adding things

- Indicator: `Stock/Indicators/<X>/` extending `SeriesRegistry.seriesTypes.sma` (or `ema`…), `defaultOptions` with `params`, `getValues(series, params)`, `registerSeriesType`; master `ts/masters/indicators/<x>.src.ts` + import in `indicators-all.src.ts`; stock tools lists in `StockToolsUtilities.ts`; `npx gulp dependency-mapping`; tests in `samples/unit-tests/indicator-<x>/`.
- Range button: config only; a new button `type` needs `computeButtonRange`, `clickButton`, `updateButtonStates` and lang texts.
- Stock tool: binding in `StockToolsBindings.ts`; GUI entry in `stockTools.gui`, icon, `classMapping`, lang.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Navigator masks, handles, placement | `Navigator::render`, `drawMasks`, `drawHandle` | `ChartNavigatorComposition` `onChartAfterSetChartSize` |
| Navigator series stale after update or drill up | `Navigator::setBaseSeries`, `updateNavigatorSeries` | `NavigatorComposition` |
| Live data: zoom doesn't stick to newest point | `Navigator::updatedDataHandler`, `modifyBaseAxisExtremes` | ordinal overscroll |
| Enabling navigator or scrollbar by update | `StockChart::init`, `Navigator::update` | `ChartNavigatorComposition::onChartUpdate` |
| Standalone navigator | `StandaloneNavigator` | `OrdinalAxis` pan |
| Range button selected or disabled wrongly | `RangeSelector::updateButtonStates` | `computeButtonRange` |
| Button gives wrong range | `RangeSelector::clickButton`, `getYTDExtremes` | `RangeSelectorComposition` `axisMinFromRange` |
| Range selector layout, dropdown | `RangeSelector::alignElements`, `handleCollision` | `onChartGetMargins` |
| Date inputs | `RangeSelector::drawInput`, `setInputValue`, `getInputValue` | |
| Ordinal x/px wrong, ticks off | `OrdinalAxis` `val2lin`, `lin2val`, `getExtendedPositions`, `beforeSetTickPositions` | core `Axis.translate` |
| Ordinal pan, overscroll | `OrdinalAxis` `onChartPan`, `onAxisFoundExtremes` | `Pointer.ts` |
| Grouped points, anchors, approximation | `DataGroupingSeriesComposition::applyGrouping`, `groupData`, `getDGApproximation` | `ApproximationDefaults.ts` |
| Grouped tooltip header | `DataGrouping` `onTooltipHeaderFormatter` | `DataGroupingDefaults` |
| compare, cumulative | `DataModifyComposition` | `Series.translate` |
| Crosshair label, lines across panes | `StockChart` `onAxisAfterDrawCrosshair`, `onAxisGetPlotLinePath` | |
| Indicator doesn't recalculate | `SMAIndicator::init`, `recalculateValues`, `getValues` | `MultipleLinesComposition` |
| Last price line | `PriceIndication` | |
| Stock tools popup, panes, buttons | `NavigationBindings::fieldsToOptions`, `StockToolsUtilities::manageIndicators`, `StockToolbar` | `PopupIndicators.ts` |
| Flag position | `OnSeriesComposition::translate`, `FlagsSeries::drawPoints` | |

Tests: `samples/unit-tests/{stockchart,navigator,rangeselector,scrollbar,stock-tools,indicator-*}/`, `series/{datagrouping*,compare,cumulative}`, `axis/{ordinal,overscroll}`.

## Core vs module

Core has only hooks and optional reads: `forceCropping?.()`, `dataModify?.`, `ordinal?.positions`, `isInternal`, `options.isStock`. Fix stock bugs in stock files. Navigator features must also work in `modules/navigator` (no StockChart, range selector, grouping or ordinal) and in gantt (`isStock` false). Generic grouping logic belongs in `Extensions/DataGrouping`.

## Gotchas

- Navigator axes and series sit in `chart.xAxis`, `yAxis` and `series` with `isInternal`; filter them in loops.
- Ordinal is on by default, but `axis.isOrdinal` is false for evenly spaced data; use `toPixels`/`toValue`.
- Stock defaults are shared objects; range selector buttons are mutated in place and shared across charts.
- Grouping defaults apply only to types in `seriesSpecific` or with `useCommonDataGrouping`; `allowDG: false` opts out.
- `setExtremes` trigger strings (`navigator`, `pan`, `rangeSelectorButton`…) change behavior; always pass `trigger`.
- Navigator, scrollbar and range selector are bundled separately into stock, gantt, navigator and a11y; at runtime the first loaded wins.
- Indicator masters read their parent from `seriesTypes` at load, so the parent must load first. Stock tools needs annotations loaded first.
