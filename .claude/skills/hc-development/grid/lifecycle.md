# Grid lifecycle

## Files

- `Core/Grid.ts`: `Grid.grid` factory, constructor, `render`, `renderViewport`, `update`, `updateColumn`, `redraw`, `setSorting`, `destroy`, `getOptions`, `showLoading`, `hideLoading`, caption, description, hover and sync state (`hoverRow`, `syncRow`…).
- `Core/Defaults.ts`: `defaultOptions`, `defaultLangOptions`, `setOptions`. Types in `Core/Options.ts`.
- `Core/DeprecatedOptions.ts` with the generated `DeprecatedOptionsMetadata.ts`: warnings from `loadUserOptions` and `setOptions`.
- `Core/ColumnPolicyResolver.ts`: the per-column options map, binding to source columns (`dataId`), capability checks (sortable, filterable, editable, exportable) and the columns to render.
- `Core/Responsive/ResponsiveComposition.ts`: `responsive.rules`, applied with `grid.update` from a ResizeObserver. Composed in Lite and Pro.

## Flows

- Create: `loadUserOptions` (merge, deprecation warnings, column options merged by `id`), `QueryingController`, `TimeBase`, fire `beforeLoad`, push to `Grid.grids`, then `render()`, the callback and `afterLoad`.
- `render()`: `destroy(true)` if rendered, new data provider and `init()`, container, accessibility, pagination, `refreshAvailableSourceColumnIds` (fires `refreshSourceColumnIds`), `querying.loadOptions()` and `proceed()`, then `renderViewport()`.
- `renderViewport()`: keep the old table's state (`getStateMeta`), destroy it and the credits, fire `beforeRenderViewport`, caption, top pagination, then `new Table()` and `init()` (or the no-data message), `applyStateMeta`, a11y regions, bottom pagination, description, fire `afterRenderViewport`, `reflow()`.
- `Table.init()`: loading indicator, virtualization decision, columns (`Column.init` loads its data from the presentation table), header, first rows, fire `afterInit`, `reflow()`.
- `update(options, redraw = true, oneToOne = false)`: fire `beforeUpdate`, `loadUserOptions` returns the diff, fire `processUpdateDiff` (listeners remove the keys they handle), map the rest to dirty flags, `redraw()`, fire `afterUpdate`. `updateColumn(id, options)` does the same for one column, but without `processUpdateDiff`.
- `redraw()`, queued: with the `'grid'` flag, a full `render()`. Otherwise: provider `init()`, refresh source columns, reload querying options if sorting, filtering or pagination changed, reload widths if resizing is dirty, `viewport.updateRows()` or `reflow()`, refresh toolbar and filter state, update classes, `pagination.redraw()`, fire `afterRedraw`.
- `destroy(onlyDOM)`: fire `beforeDestroy`, destroy provider, a11y, pagination and table, empty the container. Unless `onlyDOM`, delete all properties and remove the grid from `Grid.grids`.

## Update diff to dirty flags

| Changed option | Effect |
|---|---|
| `data`, `dataTable` | new data provider, `'grid'` |
| column `enabled`, or a new column | `'grid'` |
| column `cells.*` (`format`, `formatter`, `className`…) | `'rows'` |
| column `width`, `minWidth`, `maxWidth` | widths reloaded, reflow |
| column `sorting.order`, `sorting.compare` | `'sorting'`; `sorting.orderSequence`: nothing; other `sorting.*`: `'grid'` |
| column `filtering.rule`, `filtering.operators` | `'filtering'`; other `filtering.*`: `'grid'` |
| `pagination.page`, `pagination.pageSize` | re-query through `Pagination.update`; `alignment` and `className` are updated in place; other `pagination.*`: `'grid'` |
| `className` of `caption`, `description`, `rendering.table` | `'classes'` |
| `lang.locale`, `time` | `time.update()` only |
| Pro `events` | nothing |
| anything else | `'grid'` |

A full re-render is correct for any option. Add a cheaper path only if a re-render is too slow or loses visible state: a branch in `Grid::update` or `loadColumnOptionDiffs`, or a `processUpdateDiff` listener in the feature (it sees `update()` diffs, not `updateColumn()` ones).

## Events Core fires

Listeners added on a class also run for its subclasses: `fireEvent` walks the prototype chain.

- Grid: `beforeLoad`, `afterLoad`, `beforeUpdate`, `processUpdateDiff`, `afterUpdate`, `beforeRedraw`, `afterRedraw`, `beforeRenderViewport`, `afterRenderViewport`, `beforeDestroy`, `refreshSourceColumnIds`, `getGroupedModifiers`, `resolveFilterCondition`, `projectPresentationTable`, `beforeSort`, `afterSort`
- Table: `beforeInit`, `afterInit`, `afterReflow`, `bodyScroll`, `getViewportTopInset`, `beforeRestoreCellFocus`, `afterDestroy`
- Column: `afterInit`, `beforeSort`, `afterSort`, `beforeFilter`, `afterFilter`, `afterResize`
- TableRow: `afterLoadData`, `afterUpdateAttributes`
- TableCell: `afterRender`, `beforeEditValue`, `afterEditValue`, `afterDataMutation`, `getEditability`, `mouseDown`, `click`, `dblClick`, `keyDown`, `outdate`; `mouseOver`, `mouseOut` from `Cell`
- HeaderCell: `afterRender`, `click`
- Pagination: `beforePageChange`, `afterPageChange`, `beforePageSizeChange`, `afterPageSizeChange`

Hook slots that are not events: `RowsVirtualizer` `getEffectiveRowCount`, `afterRenderRows` and `beforeInitialRenderRows`, and `Table.afterUpdateRowsHooks`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| `update()` ignored, partly applied or too slow | `Grid::update`, `loadColumnOptionDiffs`, `redraw` | `processUpdateDiff` listeners, `Pagination::update` |
| Locale or time zone change not applied | `Grid::update` `lang` and `time` branches (no dirty flag) | `TimeBase::update` |
| Column options lost, duplicated or on the wrong column | `Grid::setColumnOptions`, `setColumnOptionsOneToOne`, `reloadColumnOptions` | `ColumnPolicyResolver`, `Column` constructor, `Grid::getOptions` |
| Columns missing, extra or in the wrong order | `Grid::getEnabledColumnIDs`, `ColumnPolicyResolver::getColumnsForRender` | `header` option, `data.autogenerateColumns` |
| Scroll, focus or widths lost after an update | `Grid::renderViewport` (`getStateMeta`, `applyStateMeta`) | `Table::destroy` |
| Loading indicator stuck or missing | `Grid::showLoading`, `hideLoading` (calls aren't counted) | callers in `Table` and `TableCell` |
| Caption, description or no-data message | `Grid::renderCaption`, `renderDescription`, `renderNoData` | `setHTMLContent` |
| Errors or leaks after `destroy()` or a re-render | `Grid::destroy`, `Table::destroy` | `afterDestroy` listeners; document listeners added by `Table` |
| Responsive rule not applied or not undone | `ResponsiveComposition` `setResponsive`, `matchResponsiveRule`, `getColumnUndoOptions` | `Grid::update` |
| Deprecated option ignored or not warned | its runtime fallback at the use site; `DeprecatedOptions::matchesDeprecatedOption` | regenerate `DeprecatedOptionsMetadata.ts` |

## Must change together

- New Core option: type and doc comment (`@default`, `@sample`) in `Options.ts` or the feature's options file; runtime default in `Defaults.ts` or the class; root options also in `tools/gulptasks/grid/api-docs.md`; docs page and `docs/sidebars.js`; sample; test.
- New lang string: `defaultLangOptions` and `LangOptions`, or the Pro feature's lang defaults and types.
- New public class or function: both masters (the `G` object and the named exports), `ts/Grid/index.ts` if Dashboards needs the type, and `test/typescript-dts/grid/`.

## Gotchas

- `grid.viewport` doesn't exist until `afterLoad`, and every full re-render replaces it. Don't keep rows, cells or columns across an `update()`.
- `merge` doesn't copy arrays, so `options.columns` is `userOptions.columns`, holding the user's own column objects. UI actions write back into them (sort order, filter rule, widths, page), and `Column` adds id-only entries that `getOptions()` strips.
- `options` is merged onto the previous `options`, not onto fresh defaults, so `setOptions()` doesn't reach an existing grid. `rendering.rows.virtualization`, `rendering.rows.virtualizationThreshold` and `rendering.columns.virtualization` are read from `userOptions` only.
- A full re-render recreates the data provider (the remote one refetches) and destroys the table twice, so `afterDestroy` listeners must be idempotent.
