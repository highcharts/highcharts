# Dashboards sync

Paths relative to `ts/Dashboards/Components/`.

## Files

- `Sync/Sync.ts`: one `Sync` per component (`component.sync`). `prepareSyncConfig` merges the component's `predefinedSyncConfig` with the user's `sync` options; `start()` creates the enabled emitters and handlers; `stop()` runs their cleanups and restarts on the next `afterUpdate`.
- `Sync/Emitter.ts`, `Sync/Handler.ts`: call the emitter or handler function with the component as `this` and keep the cleanup function it returns.
- `<Name>Component/<Name>Syncs/`: `<Name>Syncs.ts` lists the component's `defaultSyncPairs` and `defaultSyncOptions`; each `<Name><Type>Sync.ts` exports `{ defaultOptions, syncPair: { emitter, handler } }`.
- `ts/Data/DataCursor.ts` (`board.dataCursor`): `addListener(tableId, state, fn)`, `emitCursor(table, cursor, event?, lasting?)`, `remitCursor`, `removeListener`. A cursor is a `position` (row, column) or a `range` (rows, columns) with a `state` string.

## Built-in syncs

| Sync | Emits | Handles |
|---|---|---|
| `highlight` | Highcharts (point `mouseOver`, `mouseOut`), Grid (Grid Pro `cellMouseOver`, `cellMouseOut`) | Highcharts (tooltip, hover state, crosshair), Grid (`syncRow`, `syncColumn`, scroll) |
| `extremes` | Highcharts (axis `afterSetExtremes`, reset zoom), Navigator | Highcharts (`setExtremes`, needs `chart.zooming.type`), Grid (scroll to the first row), KPI (value of the last row), Navigator |
| `visibility` | Highcharts (series `show`, `hide`) | Highcharts (`setVisible` by series name), Grid (`updateColumn` with `enabled`) |
| `crossfilter` | Navigator (sets a `FilterModifier` on the table) | every component on that table, through `tableChanged` |

## Flows

- Chart hover to grid row: the highlight emitter sets `point.events.mouseOver`, converts the point index to the table's original row index, and emits a `position` cursor with state `point.mouseOver`. The Grid handler converts it back to a presentation row and calls `grid.syncRow` and `syncColumn`.
- Grid hover to chart point: the emitter listens to the Grid Pro `cellMouseOver`; the Highcharts handler finds the series by `affectedSeriesId`, or by matching table and `columnAssignment`, then refreshes the tooltip and sets the hover state.
- Extremes: `afterSetExtremes` emits lasting `xAxis.extremes.min` and `max` cursors with the first and last visible row. The Highcharts handler calls `setExtremes` with `trigger: 'dashboards-sync'`, and the emitter ignores that trigger, to avoid loops.
- Crossfilter: the navigator's emitter awaits `table.setModifier()` with a `FilterModifier`. The table fires `afterSetModifier`, and every component on that table re-reads `getModified()`.

## Rules

- Components sync only if they use the same `DataTable` instance: cursors are keyed by table id.
- Cursor rows are original table row indexes. Emitters convert from local (presentation) indexes with `getOriginalRowIndex`, and handlers convert back with `getLocalRowIndex`.
- `sync.<name>.group` appends `':' + group` to every state. Emitter and handler must add it the same way.
- Custom syncs: `emitter` and `handler` functions in `sync.<name>`, with the component as `this`, each returning a cleanup function (`docs/dashboards/synchronize-components.md`).

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Highlight hits the wrong point or row, or nothing | `HighchartsHighlightSync` emitter and handler; `GridHighlightSync` | original and local row conversion; `affectedSeriesId`; group suffix; Grid Pro loaded |
| Extremes don't sync, or zoom reset breaks with groups | `HighchartsExtremesSync` | `chart.zooming.type`; the Grid, KPI and Navigator extremes handlers; first-table lookups |
| Visibility doesn't match | `HighchartsVisibilitySync` (by series name); `GridVisibilitySync` | series `name` equals its `seriesId` |
| Crossfilter doesn't filter, or counts are wrong | `NavigatorCrossfilterSync`; `NavigatorComponent::generateCrossfilterData` | `NavigatorSyncUtils`; `NavigatorComponent::getAxisExtremes` |
| Sync stops after `update()` or runs twice | `Sync::start`, `stop` | the component emits `afterUpdate`; `start()` adds an `update` listener every time it runs |

## Must change together

A new built-in sync: emitter and handler, each returning a cleanup; the same state string and group suffix on both sides, keyed on the same table id; row index conversion on both sides; entries in the component's `defaultSyncPairs` and `defaultSyncOptions`; the options type.

## Gotchas

- Emitters overwrite `point.events.mouseOver`, `mouseOut` and `series.events.show`, `hide` through `series.update`, and their cleanup sets them to `undefined`.
- Navigator syncs read `DataModifier.types.Filter` when their module loads, so `FilterModifier` must be imported first (the master does).
- Extremes and crossfilter code uses the component's first table; highlight and visibility honor `dataTableKey`.
