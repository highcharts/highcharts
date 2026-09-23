# Highcharts Maps

`highmaps` = core + `modules/map`. Nothing here is in core.

## Files

- Masters: `modules/map` (imports `coloraxis`; composes GeoJSON, MapBubble, MapNavigation, MapView), `heatmap`, `coloraxis`, `tilemap` (needs heatmap), `tiledwebmap`, `flowmap`, `geoheatmap` (need map).
- `Core/Chart/MapChart.ts`: `mapChart()`, `init` defaults (`chart.type: 'map'`, xy panning, map credits), legacy `mapZoom`, `update` of `chart.map`.
- `Maps/MapView.ts`: center, zoom, `minZoom`/`maxZoom`, padding, insets, `fitToGeometry`, recommended view, coordinate conversion, pan, pinch and selection handlers. Defaults in `MapViewDefaults.ts`.
- `Maps/Projection.ts` + `Projections/*` + `ProjectionRegistry.ts` (EqualEarth, LambertConformalConic, Miller, Orthographic, WebMercator): rotation, geodesics, antimeridian cutting, clipping, `path()`.
- `Maps/GeoJSONComposition.ts`: `geojson()`, `topo2geo()`, map credits, `chart.fromLatLonToPoint` etc.
- `Maps/MapNavigation.ts` (buttons, wheel, double-click), `MapPointer.ts` (Pointer additions), `MapSymbols.ts`, `MapUtilities.ts`.
- Series: `Map` (join, projection), `MapLine`, `MapPoint`, `MapBubble`, `Heatmap` and `Tilemap` (cartesian), `TiledWebMap` (+ `Maps/TilesProviders/*`), `GeoHeatmap`, `FlowMap`.
- `Series/ColorMapComposition.ts`, `Core/Axis/Color/*` (color axis), `Core/Geometry/PolygonClip.ts`.

## Flows

- Init: `mapChart()` → `MapChart.init` → chart `afterInit` → `new MapView` → `recommendMapView` (from `chart.map` or series `mapData`; fires `onRecommendMapView`) → `Projection`, insets.
- Fit: chart `afterSetChartSize` → `fitToBounds` → projected bounds from `fitToGeometry`, projection bounds or series bounds → `setView`.
- Series: `MapSeries.processData` joins `mapData` by `joinBy` → `translate` → `MapPoint.getProjectedPath` → `Projection.path` (rotate, geodesics, antimeridian cut, `forward`, clip) → paths in projected units → `drawPoints` into `transformGroups` with an SVG transform.
- Zoom and pan (wheel, buttons, double-click, drag, pinch, selection) all end in `MapView.setView` → `render` → fires `afterSetView` → series with `useMapGeometry` redraw. MapView cancels core `pan` with `preventDefault`.
- Colors: color axis created on `afterCreateAxes`; series `translateColors` → `toColor`; legend shows the gradient or data classes.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| View wrong after init, resize or data change; zoom limits | `MapView::setView`, `fitToBounds` | `MapSeries::translate` |
| Wheel, double-click, buttons, pinch | `MapPointer`, `MapNavigation::updateEvents` | core `Pointer.ts`; a11y `ZoomComponent` |
| Auto projection, `chart.map`, TopoJSON, credits | `MapView::recommendMapView`, `GeoJSONComposition` | `MapChart::update` |
| Antimeridian streaks, poles, clipped shapes | `Projection::path`, `cutOnAntimeridian`, `insertGeodesics` | `PolygonClip`, `Projections/<X>::forward` |
| Insets | `MapViewInset` in `MapView.ts` | `MapSeries::getProjectedBounds` |
| `joinBy`, `allAreas`, names | `MapSeries::processData`, `setOptions` | `MapPoint::applyOptions` |
| Label or bubble anchor on shapes | `MapPoint::getProjectedBounds` (midX/midY) | `MapPointSeries::translate` |
| Border width under zoom; states | `MapSeries::pointAttribs`, `getStrokeWidth` | `MapLineSeries::pointAttribs` |
| Null points, data class visibility | `MapSeries::pointAttribs`, `MapPoint::setVisible` | `ColorAxis`, `ColorMapComposition` |
| Map drilldown | `Extensions/Drilldown/Drilldown.ts` | `mapView.allowTransformAnimation` |
| Tiles missing after update or pan | `TiledWebMapSeries::drawPoints` | `MapView::update` must redraw |
| Heatmap cells or canvas | `HeatmapPoint::getCellAttributes`, `HeatmapSeries::drawPoints` | |
| Color axis legend or marker | `ColorAxis`, `ColorAxisComposition` | `ColorAxisBase::toColor` (solid gauge too) |

Tests: `samples/unit-tests/{maps,series-map,series-heatmap,series-tilemap,coloraxis}/`.

## Core vs module

Maps extends core by composition: `MapPointer` wraps Pointer, `GeoJSONComposition` extends Chart, MapView hooks `pan`, `touchpan` and `selection`. Core already has some map-specific code (`keepProps` map entries, `hasCartesianSeries` guards); don't add more. Put the fix in the map series class or a hook.

## Gotchas

- Two coordinate systems: Map, GeoHeatmap and TiledWebMap draw in projected units and zoom by SVG transform (divide pixel sizes by `mapView.getScale()`); MapPoint, MapBubble and FlowMap recompute pixels on every redraw.
- `chart.mapView` exists only for `mapChart()`; map series in a plain chart draw nothing.
- Map series are not cartesian; adding a cartesian series (heatmap, line) turns axes on.
- Clear caches together when geometry or projection changes: `clearBounds()`, `fitToGeometryCache`, TopoJSON cache.
- Flowmap, geoheatmap, tiledwebmap, tilemap and mapbubble read their base class from `SeriesRegistry.seriesTypes` at load, so the base module must load first.
