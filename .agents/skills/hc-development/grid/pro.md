# Grid Pro

Paths relative to `ts/Grid/Pro/`.

## How Pro attaches

- `ts/masters-grid/grid-pro.src.ts` calls each feature's `compose()` once, in this order, which is also the order their listeners run unless one passes `addEvent`'s `order` option (summary rows run their `projectPresentationTable` listener first this way): GridEvents, CellEditing, CreditsPro, Exporting, Validator, CellRenderers, Pagination, LicenseValidation, RowPinning, TableEditing, TreeView, SummaryRows, SummaryColumns, Responsive.
- A `compose()` is guarded by `pushUnique(Globals.composed, '<Name>')`, merges its option and lang defaults into `defaultOptions`, and adds `addEvent` listeners on Core classes. Option types use `declare module '../../Core/Options'`; new properties use `declare module` on the class.
- The only prototype override is `Column.prototype.createCellContent`, replaced by CellRenderers. Row pinning and summary rows also use the `RowsVirtualizer` hook slots and `Table.afterUpdateRowsHooks`, and add their own `<tbody>` with `Table.registerBodySection`.
- Events only Pro fires: `cellMouseOver` and `cellMouseOut` (Dashboards highlight sync listens to them), `startedEditing`, `stoppedEditing`, `beforeRowPin`, `afterRowPin`, `beforeTreeRowToggle`, `afterTreeRowToggle`.

## Features

| Feature | Files | Attaches to |
|---|---|---|
| Events | `GridEvents.ts` | Grid `beforeLoad`, `afterLoad`, `beforeUpdate`, `afterUpdate`, `beforeRedraw`, `afterRedraw` to root `events`; Column `afterResize`, `beforeSort`, `afterSort`, `beforeFilter`, `afterFilter` to column `events`; TableCell `click`, `dblClick`, `mouseOver`, `mouseOut`, `afterRender` to column `cells.events`; HeaderCell `click`, `afterRender` to column `header.events`. Grid `processUpdateDiff` removes every `events` group from update diffs |
| Cell editing | `CellEditing/` | Table `beforeInit` (`viewport.cellEditing`), Column `afterInit` (edit-mode renderer), TableCell `dblClick`, `keyDown`, `afterRender`. Option `cells.editMode` |
| Validation | `ColumnTypes/Validator*.ts` | Table `beforeInit` (`viewport.validator`), `afterDestroy`. Rules in `Validator.rulesRegistry`; defaults per data type and renderer in `predefinedRules` |
| Cell renderers | `CellRendering/` | Column `afterInit` (`column.cellRenderer`). Each renderer registers with `registerRenderer`: `text`, `checkbox`, `select`, `textInput`, `numberInput`, `dateInput`, `timeInput`, `dateTimeInput`, `sparkline`. Content classes in `ContentTypes/` |
| Row pinning | `RowPinning/` | Grid `beforeLoad`, `beforeUpdate`; Table `beforeInit`, `afterReflow`, `bodyScroll`; virtualizer hooks; context-menu actions |
| Table editing | `TableEditing/` | Grid `beforeLoad`; context-menu actions for adding and deleting rows and columns |
| Tree view and row grouping | `TreeView/` | Grid `projectPresentationTable`, `resolveFilterCondition`, row toggle events; Table focus and inset events; cell `getEditability`; sticky group rows |
| Summary rows | `SummaryRows/` | Grid `projectPresentationTable` (order 0); Table hooks; own `<tbody>` |
| Summary columns | `SummaryColumns/` | Column `afterInit` (`valueResolver`); Grid `refreshSourceColumnIds`, `getGroupedModifiers` |
| Aggregation | `Aggregation/` | used by tree view and summaries; functions from `ts/Data/Formula` |
| Export to CSV and JSON | `Export/` | Grid `beforeLoad` (`grid.exporting`) |
| Remote data | `Data/` | data provider `'remote'` ([data.md](data.md)) |
| Pagination events | `Pagination/` | Pagination page events to `pagination.events` |
| License, credits | `License/`, `Credits/` | Grid `afterLoad`, `afterUpdate`; `afterRenderViewport` |

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Editing doesn't start, stop or save | `CellEditing::startEditing`, `stopEditing` | `TableCell::setValue`, `isEditable` and the `getEditability` event; `CellEditingComposition::createEditModeRenderer`; the provider's `setValue` |
| Validation rules or messages | `Validator::validate`, `rulesRegistry`, `predefinedRules` | `Validator::initErrorBox`; `lang.validationNotifications` |
| Wrong renderer or cell content | `CellRenderersComposition`, the renderer and its `ContentTypes/` class | `CellRendererRegistry`, `defaultEditingRenderer` |
| Sparklines missing | `SparklineRenderer::useHighcharts` | Highcharts loaded before Grid Pro |
| Row pinning | `RowPinningController::pin`, `unpin`, `toggle`, `loadOptions` | `RowPinningView::render`, `getScrollableRowCount`; composition hooks |
| Tree view, grouping, expand and collapse | `TreeProjectionController::sync`, `projectTable`, `toggleRow` | `TreeViewComposition::onProjectPresentationTable`, `TreeStickyRowController::refreshNow`, `decorateTreeViewCell` |
| Summary rows | `SummaryRowsController::updateFromTable`, `buildSummaryRow`, `getPageRange` | `SummaryView::render`, `reflow` |
| Summary columns | `SummaryColumnsComposition` `onColumnAfterInit`, `resolveAggregatedValue`, `onGridGetGroupedModifiers` | `SummaryColumnsModifier` |
| CSV or JSON export | `Exporting::getCSV`, `getJSON` | `Exporting::getDataTable`; `ColumnPolicyResolver::isColumnExportable` |
| Event callback not called | `GridEvents` | the Core event it maps |
| License warning, Pro credits | `LicenseValidation::validate`, `CreditsPro::render` | |

## Must change together

- New Pro option: types with `declare module '../../Core/Options'` in the feature, defaults merged in `compose()`, runtime code only under `ts/Grid/Pro`, CSS in a Pro CSS file that `grid-pro.css` imports.
- New Pro feature: a `compose()` called from `grid-pro.src.ts` at the right place in the order; public classes in the master's `G` object and exports, and in the TypeDoc entry points (`tools/gulptasks/grid/api-docs.json`).
- New cell renderer: a `CellRenderer` subclass and a content class, `registerRenderer`, the `CellRendererTypeRegistry` declaration, `defaultEditingRenderer`, and `Validator.predefinedRules.renderer`.
- New context-menu action: `registerBuiltInAction` or `registerBuiltInGroup`, the `CellContextMenuBuiltInActionIdRegistry` or group registry declaration, and lang labels.

## Gotchas

- Composition order matters. Row pinning replaces the virtualizer's `beforeInitialRenderRows` and summary rows chain onto it, so row pinning must be composed first.
- Saving an edit needs the validator: without `ValidatorComposition`, `stopEditing(true)` always fails.
- Export reads `getDataTable`, so it works with the local provider only.
- Sparklines use `window.Highcharts` if it exists when Grid Pro loads; otherwise call `Grid.CellRendererRegistry.types.sparkline.useHighcharts(Highcharts)`.
- The remote provider fires neither `projectPresentationTable` nor `getGroupedModifiers`, so tree view and summaries don't work with it.
