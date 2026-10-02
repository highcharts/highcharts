# Series and points

Data labels: [data-labels.md](data-labels.md). Series types and families: [../series/index.md](../series/index.md).

## Files

Core:

- `Core/Series/Series.ts`: base class. Init, options, axes; data ingest (`setData`, `setDataFromArray`, `setDataFromTable`, `matchPoints`); columns (`getColumn`, `getX`); pipeline (`processData`, `cropData`, `generatePoints`, `getExtremes`, `translate`, `render`, `redraw`); `setClip`, `animate`; markers (`drawPoints`, `markerAttribs`, `pointAttribs`); `applyZones`; KD tree (`searchPoint`, `buildKDTree`); `addPoint`, `removePoint`, `update`, `remove`, `destroy`, `setState`, `setVisible`, `select`. Statics `keepProps`, `keepPropsForPoints`.
- `Core/Series/Point.ts`: `applyOptions`, `optionsToObject`, `isValid`, `getZone`, `update`, `remove`, `select`, `destroy`, `setState`, `haloPath`, `pos`, `tooltipFormatter`, `firePointEvent`.
- `Core/Series/SeriesDefaults.ts`: `plotOptions.series` defaults and doclets (`cropThreshold` 300, `turboThreshold` 1000). `SeriesRegistry.ts`: `seriesTypes`, `registerSeriesType`.
- `Data/DataTableCore.ts` (behind `series.dataTable`), `Data/ColumnUtils.ts`.
- Core types: `Series/Line` (`drawGraph`, `getGraphPath`), `Area` (`getStackPoints`), `Spline` (`getPointSpline`), `AreaSpline`, `Column` (`getColumnMetrics`, `crispCol`, `translate`, `drawPoints`, `pointAttribs`, `animate`, `drawTracker`), `Bar` (inverted column), `Scatter` (jitter), `Pie` (+ `PiePoint`), `Series/CenteredUtilities.ts` (`getCenter`).
- `*Options.ts` and `*Point.ts` stubs are types only; option doclets live in `*Defaults.ts`.
- Not core: `Series3D.ts` (3d). `DataSeriesComposition.ts` and `DataSeriesConverter.ts` are dead code, in no bundle.

## Flows

- Init: `Chart.initSeries` → `Series.init` → `setOptions` (fires `setOptions`; merges `plotOptions[type]`, `plotOptions.series`, series options; tooltip options; zones; fires `afterSetOptions`) → `dataTable` → `bindAxes` → colors and symbols → `setData` → fires `afterInit`.
- Ingest: `setData` → `setDataFromArray` (above `turboThreshold`, turbo mode writes columns directly; else `optionsToObject` per item) or `setDataFromTable` → `table.setColumns` → `matchPoints` tries a soft update (match by id, name, index column, then x), else all points are rebuilt. Then `chart.redraw`.
- Redraw (see [index.md](index.md)): `updatedData` fires on series with `isDirtyData`; axis `setScale` calls `getExtremes` (y) and, on x axes, `processData` → `cropData` when sorted and over `cropThreshold` (sets `dataTable.modified`, `cropStart`, `closestPointRange`); then `series.redraw` = `translate` + `render`.
- `translate`: `generatePoints` (reuses `data[cropStart + i]` or creates points; fires `afterGeneratePoints`) → per point `plotX`, stack values (`stackY`, `percentage`, `StackItem.setOffset`), `dataModify` (stock compare), `plotY`, `isInside`, `negative`, `zone` → fires `afterTranslate`. Column adds shape args and fires `afterColumnTranslate`.
- `render`: see [index.md](index.md).
- `Point.update` fires `update`; default action: `applyOptions`, write the row to `dataTable`, dirty flags, redraw. `addPoint` inserts a row, fires `addPoint`. `Point.remove` → `removePoint` (fires `remove`, deletes the row). Animated removal keeps the point in `series.condemnedPoints` until the next series redraw and destroys it when the animation ends.
- `Series.update`: diff against `userOptions`, fires `update`, decides whether points survive, `remove` + `init()` again on the same object, fires `afterUpdate`.

## Extension points

- Series events and main users: `afterSetOptions` (data grouping, a11y), `bindAxes` (color axis), `afterInit` (data sorting, compare, polar), `afterGeneratePoints` (broken axis), `afterProcessData`, `afterGetExtremes`, `afterTranslate` (3D, color axis, polar, scatter jitter), `render`/`afterRender`, `afterUpdate`, `destroy` (boost), `show`/`hide`, `updatedData` (fired by Chart: ordinal, navigator, indicators), `afterColumnTranslate` (border radius, polar, waterfall).
- Point events: `afterInit` (drilldown, pattern fill), `afterSetState`, `update` (data grouping blocks grouped points), `select`.
- Flags instead of events: `dataModify` (stock compare/cumulative), `forceCropping`, `hasProcessedDataTable` (boost, map), `hasGroupedData`, `getExtremesFromAll`, `keysAffectYAxis`, `pointArrayMap`, `pointValKey`.
- Overrides: `translate` (many types; some, e.g. pie, map, heatmap, gauge, sankey, replace the base without calling it), `drawPoints` (many replace it, including `ColumnSeries`), `animate` (most replace it), `pointAttribs`, `drawTracker`. Scatter and pie copy `ColumnSeries.prototype.drawTracker`; pie also copies `pointAttribs`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Data parsed wrong (arrays, objects, `keys`, turbo) | `Series::setDataFromArray`, `Point::optionsToObject` | `getColumn`, `getX`, export-data |
| `setData` soft update wrong (matching, nulls) | `Series::matchPoints`, `setData` | `Point::update`, data sorting |
| `point.update`, `addPoint`, `remove` out of sync; ghosts | `Point::update`, `Series::addPoint`, `removePoint` | `DataTableCore.setRow`, `hasProcessedDataTable` |
| `series.update` loses or keeps wrong state | `Series::update` (`keepProps`, `hasOptionChanged`, `hasMarkerChanged`) | module props in `keepPropsForPoints` |
| Option precedence | `Series::setOptions` | `Tooltip.ts` |
| Points vanish on zoom; wrong extremes | `Series::getProcessedData`, `cropData`, `getExtremes` | `Axis::setTickInterval`, data grouping |
| Wrong stack values | `StackingAxis` `setStackedPoints`, `Series::translate` | `AreaSeries::getStackPoints` |
| Zones: clip, color, animation | `Series::applyZones`, `setOptions`; `Point::getZone` | Line/Area `drawGraph`, `ColumnSeries::pointAttribs`, boost |
| Markers missing, wrong symbol or size | `Series::drawPoints`, `markerAttribs`, `pointAttribs` | `Symbols.ts`, subclass `drawPoints` |
| Hover, select, inactive, halo | `Point::setState`, `Series::setState`, `onMouseOut` | `Pointer::applyInactiveState` |
| Tooltip picks the wrong point | `Series::searchKDTree`, `buildKDTree` | `Pointer::findNearestKDPoint` |
| Point events not firing | `Point::firePointEvent`, `manageEvent` | `ColumnSeries::drawTracker`, `Series::drawTracker` |
| Initial animation or clip | `Series::animate`, `setClip`, `afterAnimate` | column/pie `animate`, `Chart::getClipBox` |
| Errors on destroy during animation | `Point::destroy`, `Series::destroy` | `condemnedPoints` users |
| Column width, offset, centerInCategory | `ColumnSeries::getColumnMetrics`, `adjustForMissingColumns` | `StackingAxis` `setGroupedPoints` |
| Area fill, null or stack gaps | `AreaSeries::getGraphPath`, `getStackPoints` | `LineSeries::getGraphPath` |

Tests: `samples/unit-tests/series/`, `point/`, `series-<type>/`; Playwright `tests/highcharts/series/`.

## Must change together

- New per-series state that must survive `update`: add it to `keepProps` or `keepPropsForPoints`.
- New option that changes how points are built: add it to the `keepPoints` checks in `Series.update`.
- x computation: `getColumn`, `Axis.updateNames`, export-data, ordinal axis.
- Zone rendering: `applyZones`, Line/Area `drawGraph`, `ColumnSeries.pointAttribs`, boost's `WGLRenderer`.

## Core vs module

Type-specific behavior goes in the type file or its own composition, never as a type check in `Series.ts`. Core keeps generic hooks (`dataModify`, `afterColumnTranslate`, `postProcessData`, `hasProcessedDataTable`); the logic lives in stock, boost or map.

## Gotchas

- `Series.update` deletes every own property not in `keepProps`, then re-runs `init`, so `init`, `afterInit` and `setOptions` hooks run again.
- A fix in `Series.X` doesn't reach classes that replace X: check `ColumnSeries.X` and `rg "public X\("`. Changing a borrowed Column method changes scatter and pie too.
- `point.index` is the row in `dataTable` (`cropStart + i`), not the position in `points`. `series.data` has gaps when cropped. Grouped points are not in `data`.
- Two tables: `dataTable` has all rows; `getModified()` has the cropped or grouped rows. Test `isDataTable`, never `instanceof`.
- Removed points stay in `condemnedPoints` for one more redraw and still get translated and drawn; guard `condemned` and `destroyed`.
- `optionsToObject` and `applyOptions` also run on mock objects (`{ series }`, export-data) and have side effects.
- The KD tree is built lazily, after 1 ms, and rebuilt only after a dirty redraw.
- Styled mode skips `pointAttribs`; state, zone and negative styles also need class names.
