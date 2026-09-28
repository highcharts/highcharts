# Shared series helpers

Files in `ts/Series/*.ts`. Most are not in core; a bundle that imports one inlines it.

| File | Purpose | Used by |
|---|---|---|
| `CenteredUtilities.ts` | `getCenter` (center, size, innerSize in pixels; fires `afterGetCenter`), start/end radians | pie types, map, sunburst, pane (core) |
| `ColorMapComposition.ts` | `value`-colored points: `colorKey`, color axis binding, bring to front on hover | map, heatmap, tilemap, treemap |
| `CrossSymbol.ts` | `cross` symbol | contour, pointandfigure |
| `DataModifyComposition.ts` | stock `compare` and `cumulative` | stock only |
| `DerivedComposition.ts` | series computed from `baseSeries` | histogram, bellcurve, pareto |
| `DragNodesComposition.ts` | drag nodes | networkgraph, packedbubble |
| `DrawPointUtilities.ts` | create, update, animate or destroy `point.graphic` | treemap, sunburst, treegraph, venn, wordcloud |
| `FinancialSymbols.ts` | OHLC, HLC, candlestick legend symbols | stock |
| `GraphLayoutComposition.ts` | force layout registry and simulation loop | networkgraph, packedbubble |
| `InterpolationUtilities.ts` | canvas interpolation | heatmap, geoheatmap |
| `NodesComposition.ts` | nodes from `from`/`to` links, node states | sankey family, networkgraph |
| `OnSeriesComposition.ts` | place on another series (`onSeries`) | flags, windbarb |
| `PathUtilities.ts` | link paths, rounded corners | treegraph, organization, gantt pathfinder |
| `PolarComposition.ts` | polar charts | highcharts-more |
| `RangeDataLabel.ts` | range data label alignment (`alignToKey`) | arearange family, boxplot, errorbar |
| `SeriesOnPointComposition.ts` | pie or sunburst drawn on another point | `modules/series-on-point` |
| `SimulationSeriesUtilities.ts` | deferred data labels for simulations | networkgraph, packedbubble |
| `TreeUtilities.ts` | tree colors, `levels`, tree values | treemap, sunburst, treegraph, sankey, treegrid axis |
