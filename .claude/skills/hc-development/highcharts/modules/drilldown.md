# Drilldown and breadcrumbs

`modules/drilldown`. Breadcrumbs has no master of its own; it is inlined into drilldown, treemap and sunburst.

## Files

- `Extensions/Drilldown/Drilldown.ts`: `applyDrilldown`, `drillUp`, `addSeriesAsDrilldown`, `addSingleSeriesAsDrilldown`, `Axis.drilldownCategory`, `Tick.drillable`.
- `Extensions/Drilldown/DrilldownSeries.ts`: point click binding, `animateDrilldown`, `animateDrillupFrom`, `animateDrillupTo`; data label and tracker hooks.
- `Extensions/Breadcrumbs/Breadcrumbs.ts`: buttons, layout, `up` event.

## Flow

- Point `afterInit` binds click for points with `drilldown` → `runDrilldown` → fires chart `drilldown` (users may add series async) → `addSeriesAsDrilldown` (maps zoom first) → `addSingleSeriesAsDrilldown` pushes a level to `chart.drilldownLevels` and adds the series → `applyDrilldown` removes the old series, redraws, fires `afterDrilldown`, `afterApplyDrilldown`.
- `drillUp` re-adds the level's series, animates, restores extremes, fires `drillup`, `afterDrillUp`, `drillupall`.
- Breadcrumbs update on `afterDrilldown`/`afterDrillUp`; clicking fires `up` → `drillUp`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Wrong target, lost levels, zoom after drill up | `Drilldown::addSingleSeriesAsDrilldown`, `applyDrilldown`, `drillUp` | |
| Animation glitches | `DrilldownSeries` `*AnimateDrilldown`, `*AnimateDrillup*` | `applyDrilldown` |
| Map drilldown zoom, labels | `Drilldown::addSeriesAsDrilldown` (mapView branch) | `MapView.ts`, `DrilldownSeries` label hook |
| Breadcrumb text, layout | `Breadcrumbs::getButtonText`, `renderButton`, `alignBreadcrumbsGroup` | `createBreadcrumbsList`, `TreemapSeries` |

Tests: `samples/unit-tests/{drilldown,breadcrumbs}/`.

## Couplings

- Treemap and sunburst use breadcrumbs without drilldown (traverse). `chart.drillUpButton` is shared with treemap and a11y `ZoomComponent`.
- Drill animations exist only for column (and subclasses), pie and map; other types drill without animation.
- `axis.ddPoints` is rebuilt on every render by scanning all rows.
