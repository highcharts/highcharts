# Grid data and querying

Paths relative to `ts/Grid/`.

## Files

- `Core/Data/DataProvider.ts`: abstract async API: `init`, `getColumnIds`, `getRowId`, `getRowIndex`, `getRowObject`, `getRowCount`, `getColumnDataType`, `getValue`, `setValue`, `applyQuery`, `destroy`.
- `Core/Data/DataProviderRegistry.ts`: `types` and `registerDataProvider`; a new type also extends `DataProviderTypeRegistry`. `Grid::loadDataProvider` picks `data.providerType`, `'local'` by default.
- `Core/Data/LocalDataProvider.ts` (`'local'`): the original `dataTable`, from `data.dataTable`, `data.columns` or a `data.connector`, and the `presentationTable` after querying. `setValue` writes to the original table. With `updateOnChange` it re-renders on table events. `idColumn` sets row ids.
- `Pro/Data/RemoteDataProvider.ts` (`'remote'`): fetches rows in chunks through `fetchCallback`, or `dataSource` handled by `DataSourceHelper` (URL template, fetch, response parsing). Chunk cache, `chunksLimit`, `requestPolicy`. `QuerySerializer` fingerprints the query.
- `Core/Querying/`: `QueryingController` is `grid.querying`, holding `sorting`, `filtering`, `pagination` and `shouldBeUpdated`. `SortingController` builds a `SortModifier`, `FilteringController` a `FilterModifier`, `PaginationController` a `RangeModifier`. `SortingUtils` has the grid-side compare.
- UI: `Core/Table/Actions/ColumnSorting.ts`, `Core/Table/Actions/ColumnFiltering/`, `Core/Table/Header/ColumnToolbar/`, `Core/Pagination/Pagination.ts`.

## Flows

- Query: `querying.loadOptions()` reads the sorting, filtering and pagination options, and `proceed()` calls `dataProvider.applyQuery()`. The local provider runs a `ChainModifier` of the grouped modifiers (from the `getGroupedModifiers` event, then sort, then filter) on a clone, fires `projectPresentationTable` (tree view, summary rows), then applies the pagination `RangeModifier`. The result is `presentationTable`.
- Sort from the header: `HeaderCell` click, `ColumnSorting::toggle`, `setOrder`, the sorting controller, `viewport.updateRows()`. `grid.setSorting()` does the same for several columns.
- Filter from the UI: `ColumnFiltering::applyFilter`, the filtering controller, `updateRows()`.
- Page change: `Pagination::goToPage` or `setPageSize`, `PaginationController`, `updateRows()`.
- Edit: `TableCell` value, `dataProvider.setValue`, `DataTable.setCell`, which re-runs the table's modifiers.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Wrong sort order or priority | `SortingController::getSortingOptions`, `setSorting`, `createModifier` | `SortingUtils::resolveActiveGridSortings`, `SortModifier` compare in `ts/Data`, tree view sorting |
| Header click cycles wrongly, `orderSequence` | `ColumnSorting::toggle`, `setOrder` | `HeaderCell::onClick`, sort toolbar button |
| `grid.setSorting()` differs from clicking | `Grid::setSorting` | `ColumnSorting::updateColumnOptions` |
| Filter matches the wrong rows | `FilteringController::mapOptionsToFilter`, `loadOptions` | `FilterModifier` in `ts/Data`; tree view `resolveFilterCondition` |
| Filter UI state, operators, inline filter row | `ColumnFiltering::applyFilter`, `getAllowedConditions`, `refreshState` | `FilteringTypes.ts`, `FilterRow`, `ColumnPolicyResolver::isFilterOperatorSelectHidden` |
| Date filter off by the time zone | `ColumnFiltering::applyFilter` date parsing and input formatting | `grid.time` |
| Page count or page clamping | `PaginationController::createModifier`, `clampPage`, `loadOptions` | `LocalDataProvider::applyQuery`, `RemoteDataProvider::applyQuery` |
| Table changes not shown | `LocalDataProvider::handleTableChange` (needs `updateOnChange`), `initConnector` | Dashboards `GridComponent::onTableChanged` |
| Edited value not saved, wrong row | `LocalDataProvider::setValue`, `idColumn` | original and local row indexes in `DataTable` |
| Remote rows, chunks or requests | `RemoteDataProvider::fetchChunk`, `applyQuery` | `DataSourceHelper` `buildUrl`, `dataSourceFetch`, `defaultParseResponse`; `QuerySerializer::createQueryFingerprint` |

## Must change together

- Filter operators: `FilteringTypes.ts`, `FilteringController::mapOptionsToFilter`, the operator labels in `Core/Defaults.ts` lang, the remote `filterOperatorMap` in `DataSourceHelper`, and the negated operators in `TreeViewComposition`.
- Sorting semantics: the compare in `ts/Data` `SortModifier` and in Grid `SortingUtils`. The sort options are written back by both `ColumnSorting::updateColumnOptions` and `Grid::setSorting`.
- New query dimension: add it to `QuerySerializer::createQueryFingerprint`, or remote queries won't refetch.
- New data provider: every abstract method, `registerDataProvider`, and the `DataProviderTypeRegistry` declaration. `getDataTable` is needed by column data, a11y row counts, pagination totals, export, table editing, row pinning, summary rows and tree view. Tree view and summaries need the `getGroupedModifiers` and `projectPresentationTable` events, which the remote provider doesn't fire.

## Gotchas

- `sorting.order` and `filtering.rule` in `columnDefaults` are not applied: the controllers read each column's own options only.
- The local provider infers `number`, `boolean` or `string`, never `datetime`; set `dataType` for dates.
- The remote provider's `applyQuery` does nothing when the query fingerprint is unchanged.
- Modifiers, connectors and `DataTable` are in `ts/Data`, shared with Dashboards and `data-tools` ([../shared.md](../shared.md)).
