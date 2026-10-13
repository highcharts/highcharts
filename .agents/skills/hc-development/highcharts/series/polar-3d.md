# Polar and 3D

## Polar (highcharts-more)

The master runs `Pane.compose(Chart, Pointer)` and `PolarAdditions.compose(...)` (`ts/Series/PolarComposition.ts`), which also composes `RadialAxis`. Active when `chart.polar` is set; gauges set `chart.angular`.

- Chart: `createAxes` builds `chart.pane[]`; `afterDrawChartBox` renders panes.
- Pointer: `getCoordinates` wrapped (angle and radius to values); arc selection box; pane hover filter in `PaneComposition`.
- Series `afterInit`: `series.polar = new PolarAdditions(series)`.
- Series `afterTranslate`: `polar.toXY()` for non-column series; angle-based `searchPoint`; circle clip on `afterRender`.
- `afterColumnTranslate`: columns become `arc` shapes.
- Wraps: `animate`, `Point.pos`, line `getGraphPath` (`connectEnds`), spline `getPointSpline`, column `alignDataLabel`.
- Range types handle polar themselves (AreaRange `highToXY`, ColumnRange arcs).
- `Core/Axis/RadialAxis.ts` patches axis instances on `init` (`modify`, `modifyAsHidden`, undone by `unmodify`): paths, position, translation, offsets. Fix the functions in `RadialAxis.ts`, not `Axis.prototype`.
- `Extensions/Pane/Pane.ts`: center, size, angles, background; `updateCenter`.

## 3D (highcharts-3d)

The master composes Area3D, Axis3DComposition, Chart3D, Column3DComposition, Pie3DSeries, Series3D, SVGRenderer3D, ZAxis. Active when `chart.is3d()` (`options3d.enabled`).

- `Core/Chart/Chart3D.ts`: scatter becomes `scatter3d`; wraps `isInsidePlot`, `renderSeries` (reverse order); frame; marks the box dirty on every redraw.
- `Core/Series/Series3D.ts`: `afterTranslate` projects every series (`translate3dPoints`, `Math3D.perspective`).
- `Series/Column3D/Column3DComposition.ts`: cuboid shapes from the wrapped `translate`; wraps `animate`, `plotGroup`, `pointAttribs`, `setState`, `setVisible`, `alignDataLabel`, `StackItem.getStackBox`.
- Pie3D replaces `seriesTypes.pie` (2D when `!is3d()`); Area3D wraps `getGraphPath`; `Axis3DComposition`, `Tick3DComposition`, `ZAxis` for axes; `SVGRenderer3D` adds `cuboid`, `arc3d`, `polyhedron`.
- Cylinder, Funnel3D and Pyramid3D add renderer shapes and inline `Math3D` and `SVGElement3D`.

## Gotchas

- Methods copied from column at load (ColumnRange, Scatter, Pie, Gauge) miss later polar and 3D wraps.
- Event order: `afterTranslate` range (0) → polar (2) → range polar (3); `afterColumnTranslate` polar arcs (4) → border radius (9).
