# Feature map

Features spread over many files: before changing one place, find the others. Find a method's overrides and borrowers with `rg -n "^\s+(public |protected )?name\(|\.name = |^\s+name: \w" ts/`.

## Data labels

Core `DataLabel.ts`, `OverlappingDataLabels.ts`, `ColumnDataLabel.ts`, `PieDataLabel.ts`; `RangeDataLabel.ts` (more). Many types have their own `drawDataLabels` and `alignDataLabel`. See [core/data-labels.md](core/data-labels.md).

## Hover, tooltip, crosshair

`Pointer.ts` (events, `getHoverData`), `Tooltip.ts`, `Series.searchPoint` (overridden by Map, MapBubble, GeoHeatmap, polar) and KD tree, `Point.tooltipFormatter` (overridden by stock compare in `DataModifyComposition`), `point.tooltipPos` (set per series type), `Axis.drawCrosshair` (stock labels in `StockChart.ts`). Data grouping changes the header (`headerFormatter` event). See [core/interaction.md](core/interaction.md).

## Hover states and markers

`Point.setState` (overridden in several point classes), `haloPath`, `Series.setState`, `Pointer.applyInactiveState`; markers in `Series.drawPoints`, `markerAttribs`, `pointAttribs` and `getSymbol` (overridden or borrowed by many types), `Symbols.ts`. a11y forces markers (`ForcedMarkers`).

## Zoom and pan

All paths end in `Chart.transform`: selection and pan via `Pointer` (`drag`, `drop`, `pinch`), wheel via `modules/mouse-wheel-zoom`, non-cartesian via `modules/non-cartesian-zoom`. Maps replace it with `MapView` (cancels `pan`/`selection`); stock ordinal axes handle `pan`; navigator, range selector and scrollbar call `setExtremes`. Reset button: `Chart.showResetZoom`; navigator, drilldown and breadcrumbs also involved.

## Legend

`Legend.ts`, `LegendSymbol.ts`, `Series.drawLegendSymbol` (picks the `legendSymbol` option; overridden by OHLC, color axis, bubble legend), `Series.setVisible` on item click. Color axis and bubble legend add items via `afterGetAllItems`. Pie-like series use `legendType: 'point'`. a11y `LegendComponent`.

## Animation

`Fx.ts`, `AnimationUtilities.ts`, `SVGElement.animate`. `Series.animate` (initial clip): overridden in many types (column, pie, map, gauge, sankey…), mostly without calling the base. Also `Series.setClip`, `afterAnimate`, drilldown animations, `Point.destroy` (condemned points).

## Stacking

`StackingAxis.ts` (`getStacks`, `setStackedPoints` also in AreaRange and Waterfall, `percentStacker`, `setGroupedPoints` for `centerInCategory`), `StackItem.ts` (stack labels), `Series.translate` (stack values), `AreaSeries.getStackPoints`, `ColumnSeries.getColumnMetrics`, `WaterfallAxis`, streamgraph.

## Zones and negative color

`Series.setOptions` (adds the negative zone), `Series.applyZones` (also Bubble, MACD), `Point.getZone`, Line/Area `drawGraph` (zone graphs), `ColumnSeries.pointAttribs`, boost `WGLRenderer`. Styled mode uses class names.

## Null points

`Point.isValid` (per type, e.g. pie), `Series.translate` (`nullInteraction`), `LineSeries.getGraphPath` (`connectNulls`), `AreaSeries.getStackPoints`, `matchPoints` in `setData`, a11y mock points in `SeriesDescriber`.

## Time and dates

`Shared/TimeBase.ts` (formatting, timezones, parsing), `Core/Time.ts` (`getTimeTicks`), `DateTimeAxis.ts`, `Templating.dateFormat`, tooltip header date (`getXDateFormat`), `dateTimeLabelFormats` in axis, tooltip and data grouping defaults, range selector, ordinal axis, `modules/data` parsing.

## Number and text formats

`Templating.format` and `numberFormat` (tooltip, data labels, axis labels, legend `labelFormat`), `lang.decimalPoint`, `thousandsSep`, `numericSymbols` (`Axis.defaultLabelFormatter`). All markup passes `AST`.

## Colors and styled mode

`Color.ts`, `Palette.ts` (CSS vars), `Series.getColor`/`getCyclic`, `colorByPoint`, `colorIndex`, zones, color axis (`ColorAxisComposition.translateColors`), `PatternFill`, gradients in `SVGElement.complexColor`. Styled mode: every `if (!styledMode)` branch plus `css/highcharts.css`.

## Clipping and plot area

`Chart.getClipBox`, `Series.setClip`, `sharedClips`, `plotClipInner`/`Outer`, `Series.getPlotBox` (also `OnSeriesComposition`, Wordcloud), `Chart.isInsidePlot` (pane override), `ScrollablePlotArea`.

## Inverted and polar

Inverted: `Chart.propFromSeries`, `Axis.horiz`, `Series.translate`, column metrics, data label alignment, tooltip position. Polar: highcharts-more `PolarComposition`, `RadialAxis`, `Pane`; core checks `chart.polar` in Chart, Axis and Tooltip.

## Crisp lines

`crisp()` in `Shared/Utilities.ts`, `SVGElement.crisp`, `SVGRenderer.crispLine`, `ColumnSeries.crispCol`, `Axis.getPlotLinePath`, tick marks, stock `crispPolyLine`.

## Update and destroy

`Chart.update` (collections, `propsRequire*`), `Series.update` (`keepProps`, re-runs `init`), `Axis.update` (re-runs `init`), `Point.update`. `Series.destroy` (overridden by several types). Modules clean up on chart `destroy`. Handlers that run in `init` must be idempotent.

## Size and responsive

`Chart.setSize`, `reflow`, `getChartSize`, `getContainerBox`, `Responsive.ts` (rules via `chart.update`), `ScrollablePlotArea`, `Chart.getMargins`, axis label `unsquish`, legend paging.

## Export

`modules/exporting` (`getSVG`, menu, fullscreen), `export-data` (CSV, XLS, data table), `offline-exporting`, `Shared/DownloadURL.ts`, AST allowlist additions, a11y `MenuComponent`. Charts copy themselves with `forExport`.

## Lang and i18n

`lang` in `Core/Defaults.ts`, module defaults (exporting, stock tools, map navigation), `Accessibility/Options/LangDefaults.ts`, `i18n/highcharts/*.json`, generated `ts/masters/i18n/*` (`npx gulp lang-build`), `A11yI18n.ts`.
