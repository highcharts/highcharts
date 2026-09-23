# Series types

One folder per type in `ts/Series/<Type>/`. Core has only line, spline, area, areaspline, column, bar, scatter and pie. Base class internals: [../core/series.md](../core/series.md).

More: [ripple.md](ripple.md) (what a base-class change reaches), [helpers.md](helpers.md) (shared `ts/Series/*.ts` files), [polar-3d.md](polar-3d.md), [adding.md](adding.md) (new series type).

## Families

"needs X": the base class is read from `SeriesRegistry.seriesTypes` at load, so X must load first.

| Family | Types → bundle | Classes |
|---|---|---|
| Line, area | line, spline, area, areaspline (core); polygon (more); streamgraph, pareto, bellcurve (modules) | Line ← Area, Spline, Scatter, Pareto; Spline ← AreaSpline ← Bellcurve, Streamgraph |
| Range | arearange, areasplinerange, columnrange, boxplot, errorbar (more); dumbbell, lollipop (modules; need more, lollipop also dumbbell) | Area ← AreaRange ← AreaSplineRange, ColumnRange, Dumbbell; Column ← BoxPlot ← ErrorBar |
| Column-like | column, bar (core); columnpyramid, waterfall (more); variwide, bullet, dotplot, pictorial, wordcloud, windbarb, histogram, xrange, gantt (modules) | Column ← all of these; XRange ← Gantt |
| Financial | hlc, ohlc, candlestick, flags (stock); heikinashi, hollowcandlestick, renko, pointandfigure (modules, need stock) | Column ← HLC ← OHLC ← Candlestick ← HeikinAshi, HollowCandlestick |
| Pie-like | pie (core); variablepie, funnel, pyramid, item (modules); pie3d (3d) | Pie ← Funnel ← Pyramid; Pie ← Item, VariablePie, Pie3D |
| Bubble | bubble, packedbubble (more); mapbubble (map) | Scatter ← Bubble ← MapBubble, PackedBubble |
| Flow, nodes | sankey; dependencywheel, organization, arcdiagram (need sankey); networkgraph | Column ← Sankey ← DependencyWheel, Organization, ArcDiagram; Series ← Networkgraph |
| Tree | treemap, sunburst, treegraph (needs treemap) | Scatter ← Treemap ← Sunburst, Treegraph |
| Grid, color | heatmap; tilemap (needs map); contour | Scatter ← Heatmap ← Tilemap; Scatter ← Contour |
| Map | map, mapline, mappoint, mapbubble (map); flowmap, geoheatmap, tiledwebmap (need map) | Scatter ← Map ← MapLine ← FlowMap; Map ← GeoHeatmap, TiledWebMap |
| Polar, gauge | gauge and polar line/area/column (more); solidgauge (needs more) | Series ← Gauge ← SolidGauge |
| 3D | 3D column, pie, area, scatter (3d); cylinder, funnel3d, pyramid3d | Column ← Cylinder, Funnel3D ← Pyramid3D |
| Other | vector, venn, timeline | Scatter ← Vector, Venn; Line ← Timeline |

Types that borrow methods instead of inheriting: Lollipop (column, dumbbell), ColumnRange (column), Scatter, Pie and Gauge (column `drawTracker`), AreaSpline (area graph methods).

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Bubble size, z range | `BubbleSeries::getRadii`, `translateBubble` | mapbubble, packedbubble, series-on-point inherit |
| Bubble legend | `BubbleLegendComposition` | `ColorAxis::getOffset` |
| Map shapes or labels after zoom | `MapSeries::translate`, `drawMapDataLabels`, `drawPoints` | [../modules/maps.md](../modules/maps.md) |
| Heatmap cells, reversed axes | `HeatmapPoint::getCellAttributes` | `TilemapShapes` |
| Treemap labels, drilling, breadcrumbs | `TreemapSeries::drawDataLabels`, `init`, `drawPoints` | sunburst, treegraph inherit |
| Sunburst labels | `SunburstSeries::getDlOptions`, `drawPoints` | `SunburstUtilities` |
| Treegraph collapse buttons, links | `TreegraphPoint::renderCollapseButton`, `TreegraphSeries::getLinks` | |
| Sankey or org node size, columns, links | `SankeySeries::translateNode`, `createNodeColumns`; `SankeyColumnComposition` | subclass overrides; `NodesComposition` |
| Networkgraph, packedbubble labels or layout | `GraphLayoutComposition`, `SimulationSeriesUtilities` | layout classes |
| Waterfall sums, connectors | `WaterfallSeries::getCrispPath`, `toYData` | `WaterfallAxis`, `ColumnDataLabel` |
| XRange or Gantt bars, tooltip | `XRangeSeries::translatePoint`, `drawPoint` | `GanttSeries` |
| Funnel shape | `FunnelSeries::translate` | |
| Histogram bins; bellcurve | `HistogramSeries::derivedData`; `BellcurveSeries::setDerivedData` | `DerivedComposition` |
| Flags or windbarb position | `OnSeriesComposition::translate`; `FlagsSeries::drawPoints` | |
| OHLC colors, grouping | `OHLCSeries` `onSeriesAfterSetOptions`, `OHLCPoint::resolveColor` | `FinancialSymbols`, data grouping |
| Range series labels | `RangeDataLabel::alignDataLabel`, `AreaRangeSeries::drawDataLabels` | dumbbell, lollipop |
| Columnrange or boxplot shapes | `ColumnRangeSeries` `afterColumnTranslate`; `BoxPlotSeries::drawPoints` | dumbbell reuses it |
| Polar columns, clip | `PolarComposition` | [polar-3d.md](polar-3d.md) |
| Radial grid lines, pane layout | `RadialAxis`, `Pane::updateCenter` | `PaneComposition` |
| Solid gauge clip or animation | `SolidGaugeSeries::animate`, `drawPoints` | `Chart::getClipBox`, `PaneComposition` |
| 3D shapes or projection | `Series3D`, `Column3DComposition`, `Area3DSeries` | `Chart3D`, `Math3D` |

Tests: `samples/unit-tests/series-<type>/`.

## Gotchas

- Load order: `@requires` misses some dependencies (dumbbell needs more, lollipop more and dumbbell; geoheatmap, tiledwebmap need map). After 3d loads, `seriesTypes.pie` is `Pie3DSeries`.
- Copied methods (`extend(proto, { x: columnProto.x })`) don't see later polar or 3D `wrap`s. Delegate at call time when a composition must apply.
- `pushUnique(composed, key)` is global: a key shared by several classes (`'OnSeries'`) patches only the first. Use one key per class.
- Classes duplicated across bundles (bubble in more and map, heatmap in heatmap and map, treemap in treemap and sunburst, xrange in xrange and gantt): first registration wins.
- An overridden `translate` that skips super must fire `afterTranslate` itself; jitter, polar, 3D and range hooks listen to it. Column-like types must go through `ColumnSeries.translate` for `afterColumnTranslate`.
