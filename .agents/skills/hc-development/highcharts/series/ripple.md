# Ripple map

What a base-class change reaches. Check before changing a method that others inherit, borrow or override.

## ColumnSeries (core)

- Own: `translate` (fires `afterColumnTranslate`), `getColumnMetrics`, `crispCol`, `adjustForMissingColumns`, `drawPoints`, `pointAttribs`, `drawTracker`, `animate`, `init`, `remove`; `alignDataLabel` from `ColumnDataLabel.ts`.
- Subclasses calling `super`: `translate` (BoxPlot, ColumnPyramid, HLC, Variwide, XRange), `init` (HLC, Renko, Windbarb, XRange), `pointAttribs` (HLC, Pictorial), `drawPoints` (Bullet).
- Borrowed, or called directly as `ColumnSeries.prototype.x.call` (skipping overrides in between):
  - `drawTracker`: Scatter (all scatter-based types), Pie, Gauge, Timeline, Networkgraph, Sankey, Treegraph, Dumbbell
  - `pointAttribs`: Pie, Sunburst, Map, Candlestick, Waterfall, ColumnRange
  - `drawPoints`: Map, Tilemap, Sankey, Treegraph, FlowMap, ColumnRange
  - `translate`: ColumnRange, Dumbbell, OnSeriesComposition, AO/VBP/MACD
  - `alignDataLabel`: Heatmap, Treemap, Bubble, Funnel3D, Lollipop, ranges
  - `getColumnMetrics`: ColumnRange, ErrorBar, PointAndFigure, Lollipop
- `afterColumnTranslate` listeners, in order: Waterfall, Variwide (2), polar arcs (4), ColumnRange (5), BorderRadius (9).

## ScatterSeries (core)

`applyJitter` on `afterTranslate`; `drawGraph` only with `lineWidth`; `sorted: false`, `noSharedTooltip`, column `drawTracker`, `findNearestPointBy: 'xy'`. Reaches Bubble, Contour, Heatmap, Tilemap, MapPoint, Map family, PointAndFigure, Polygon, Scatter3D, Treemap family, Vector, Venn.

## PieSeries (core)

`translate` (fires `translate`, `afterTranslate`), `generatePoints`, `drawPoints`, `animate`, `redrawPoints`, `getCenter`; labels in `PieDataLabel.ts`. Funnel and Pyramid replace translate and labels; VariablePie replaces translate; Item and Pie3D call super. SolidGauge borrows `animate`; DependencyWheel borrows `getCenter`.

## AreaRangeSeries (more)

`afterTranslate` hooks (order 0: `plotLow`/`plotHigh`; order 3: polar), `getGraphPath` (two lines), `drawPoints` and `drawDataLabels` (two passes), `RangeDataLabel`. Reaches AreaSplineRange, ColumnRange, Dumbbell, Lollipop; ErrorBar borrows `drawDataLabels`.

## SankeySeries

`createNode`/`generatePoints` (NodesComposition), `createNodeColumns` (SankeyColumnComposition), `translate`, `translateNode`, `translateLink`, `pointAttribs`. DependencyWheel, Organization and ArcDiagram override parts.

## TreemapSeries

`init` (drill events, breadcrumbs), `getTree`, `setTreeValues`, `setRootNode`, `drillToNode`, `alignDataLabel`, `drawDataLabels`, `drawPoints`, `TreemapPoint.draw`. Sunburst and Treegraph reuse most of it.

## MapSeries

`translate` (projection), `drawPoints` (column drawPoints + group transforms), `pointAttribs`, `processData`, `setData`, `getProjectedBounds`. MapLine, FlowMap, GeoHeatmap, TiledWebMap inherit; MapBubble and MapPoint borrow; drilldown adds `animateDrill*`.

## HLC → OHLC → Candlestick

`HLCSeries.translate` = column translate + path `shapeArgs`; drawing is `ColumnSeries.drawPoints`. `OHLCSeries.compose` hooks every series (`useOhlcData`, grouping approximation). HeikinAshi and HollowCandlestick extend Candlestick.
