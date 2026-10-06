# Boost

`modules/boost`: WebGL rendering for large series. `boost-canvas` is a canvas fallback that must load before boost.

## Files

`Extensions/Boost/Boost.ts` (compose), `BoostChart.ts` (chart-level boosting, clip rect), `BoostSeries.ts` (series wraps, `renderCanvas`, `getPoint`), `WGLRenderer.ts` (`pushSeriesData`, render), `WGLShader.ts`, `WGLVertexBuffer.ts`, `Boostables.ts` + `BoostableMap.ts` (boostable types), `NamedColors.ts`. `Extensions/BoostCanvas.ts`.

## Flow

- Decision (wrapped `Series.processData`): boostable type (area, areaspline, arearange, column, columnrange, bar, line, scatter, heatmap, bubble, treemap), `boost.enabled` not false, and data length ≥ `boostThreshold` (5000), or the whole chart boosts (series count ≥ `boost.seriesThreshold`). Stock data grouping wins (`forceCrop`).
- Boosted: `translate`, `generatePoints`, `drawPoints`, `drawTracker` do nothing; `render` → `renderCanvas` → `WGLRenderer.pushSeries` → draw to a canvas shown as an SVG `<image>`.
- Hover: KD tree built in chunks; `searchPoint` → `boost.getPoint` creates points on demand.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Colors, zones, nulls, stacking, log axis | `WGLRenderer::pushSeriesData` | `BoostSeries::seriesRenderCanvas` |
| Boost turns on or off wrongly | `BoostSeries::getSeriesBoosting`, `wrapSeriesProcessData` | `BoostChart::isChartSeriesBoosting` |
| Zoom, extremes, cropping | `BoostSeries::scatterProcessData`, `wrapSeriesGetExtremes` | `Boost.ts` `setExtremes` handler |
| Clip, z-index, panes, navigator | `BoostSeries::createAndAttachRenderer`, `BoostChart::getBoostClipRect` | |
| Hover, tooltip, click | `BoostSeries::getPoint`, `firePointEvent` wrap | boosted branches in `Pointer.ts` |

Tests: `samples/unit-tests/boost/`, `tests/highcharts/boost/`.

## Couplings

- `.boosted` is read in core (`Pointer`, `Series`), ordinal axis, navigator, scrollbar, a11y, series label, draggable points. Features that need points must check `.boosted`: `series.points` can be empty.
- Zones and colors are reimplemented in `WGLRenderer`; change them together with core zone rendering.
- New boostable type: `Boostables.ts`, `WGLRenderer.ts`, flags in `BoostSeries.ts` `compose`.
