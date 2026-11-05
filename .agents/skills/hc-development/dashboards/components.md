# Dashboards components

Paths relative to `ts/Dashboards/`.

## Files

- `Components/Component.ts`, the base class. Statics: `defaultOptions`, `predefinedSyncConfig`, `Sync`. Methods: `load`, `render`, `update`, `resize`, `resizeTo`, `resizeDynamicContent`, `setTitle`, `setCaption`, `getDataTable(connectorId?, dataTableKey?)`, `getOptions` (a diff against the defaults), `getEditableOptions`, `getEditableOptionValue`, `getOptionsOnDrop`, `destroy`, `on`, `emit`.
- `Components/ConnectorHandler.ts`: one per `connector` entry. `initConnector` gets the connector from the board's `dataPool`; `setTable` and `setupTableListeners` turn table events into a debounced `tableChanged`; polling starts with the first component on a connector and stops with the last.
- `Components/ComponentRegistry.ts`: `types` and `registerComponent`, which doesn't overwrite. HTML registers in `Board.ts`; Highcharts, KPI and Navigator in `HighchartsPlugin`; Grid in `GridPlugin`.
- `Components/EditableOptions.ts`: what the sidebar shows, from `options.editableOptions`.
- `Actions/Bindings.ts`: `addComponent` (see [index.md](index.md#lifecycle)), `getCell`.
- One folder per component with `<Name>Component.ts`, `<Name>ComponentDefaults.ts`, `<Name>ComponentOptions.ts` and `<Name>Syncs/`.

## Components

- **Highcharts**: creates its chart through the plugin's `charter`, with `chartConstructor` `chart`, `stockChart`, `mapChart` or `ganttChart`. Series come from `connector.columnAssignment` (`{ seriesId, data }`, where `data` is a column id, a list of columns or a key-to-column map), or from `getDefaultColumnAssignment`. `updateSeries` removes series no longer assigned; `updateSeriesFromConnector` reads `dataTable.getModified()`. Dragging a point writes back with `table.setCell` (`allowConnectorUpdate`). `update` calls `chart.update`, or recreates the chart when `chartConstructor` changes.
- **Grid**: creates `new Grid()` from `GridPlugin`. With a connector, `gridOptions.data` becomes a local provider over `table.getModified()`. `update` updates the grid, or recreates it when the table changed. Edits write back through Grid (`LocalDataProvider.setValue` to `DataTable.setCell`); cell editing is Grid Pro.
- **KPI**: the value is `value`, else a `formula` over the unmodified table, else the last cell of `columnId`. It is formatted by `valueFormatter`, `valueFormat` (`Templating.format`) or `toLocaleString`, and rendered with `AST.setElementHTML`. An optional mini chart uses the plugin's `charter`.
- **Navigator**: a navigator-only chart, created in the constructor, which needs Highcharts Stock or the navigator module. Its `columnAssignment` is a column-to-role map at component level. With crossfilter it charts value counts.
- **HTML**: `elements` (AST nodes) or `html` (a string parsed by `AST`), rendered with `AST.addToDOM`.

## Board JSON

`board.getOptions()` collects each component's `getOptions()` and, in GUI mode, each layout's; `Dashboards.board(el, json)` restores it. Functions and events are not kept. `Serializable.ts` and `SerializeHelper/` convert data classes (connectors, `DataTable`, `DataCursor`) to JSON; only node tests use them now.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Component doesn't update when data changes | `ConnectorHandler::setupTableListeners`, `setTable` | the component's `onTableChanged` |
| Connector not found, loaded twice, wrong table | `DataPool::getConnector`, `loadConnector`; `ConnectorHandler::initConnector` | `DataConnector::getTable(key)`, `dataTableKey` |
| Polling doesn't start or stop | `ConnectorHandler::addConnectorAssignment`, `removeConnectorAssignment` | `DataConnector::startPolling`, `stopPolling`; `DataPool::cancelPendingRequests` |
| Chart series or `columnAssignment` wrong | `HighchartsComponent::updateSeries`, `updateSeriesFromConnector`, `getDefaultColumnAssignment` | modified table; `connector.columnAssignment` types |
| Dragged chart points don't write back | `HighchartsComponent::setupConnectorUpdate`, `onChartUpdate` | `allowConnectorUpdate`; formula columns are not draggable |
| Chart doesn't fit its cell after a resize | `HighchartsComponent::resize` | `Component::resizeTo`, `resizeDynamicContent`; ResizeObserver in `setupEventListeners` |
| Grid edits don't reach other components, or the grid is recreated | `GridComponent::update`, `onTableChanged`, `recreateGrid`, `getGridOptionsWithConnectorData` | `LocalDataProvider::setValue` in Grid |
| Grid height or scrolling in a cell | `GridComponent::resize`, `finalizeGridRender` | `grid.viewport.reflow` |
| KPI value, format, threshold color, subtitle | `KPIComponent::getValue`, `getFormulaValue`, `setValue`, `getValueColor`, `getSubtitle` | `linkValueToChart` |
| Navigator size, handles, crossfilter counts | `NavigatorComponent::adjustNavigator`, `redrawNavigator`, `renderNavigator`, `generateCrossfilterData` | `getAxisExtremes`; [sync.md](sync.md) |
| HTML content stripped or allowed | `HTMLComponent::load`, `update`, `constructTree` | the AST allowlist changes at the top of `HTMLComponent.ts`; `AST.addToDOM`, `filterUserAttributes` |
| Title, caption or content height wrong | `Component::setTitle`, `setCaption`, `resize`, `getContentHeight` | `ComponentUtilities.getMargins` |
| "Something went wrong" title | `Bindings::addComponent` (unknown type, or `load()` failed) | plugin connection and load order |
| `getOptions()` JSON incomplete or doesn't round-trip | `Board::getOptions`, the component's `getOptions` | `Layout`, `Row`, `Cell` `getOptions` |

## Must change together

- New component type: the class with `static defaultOptions` and `predefinedSyncConfig`; `<Name>ComponentDefaults.ts`, `<Name>ComponentOptions.ts` (with `type: '<Name>'`), `<Name>Syncs/`; registration in a plugin's `onRegister` or at module level, plus `declare module '../ComponentType' { interface ComponentTypeRegistry {…} }`; the master import, `G.<Name>Component` and the `Dashboards` interface in `dashboards.src.ts`; the sidebar list and `lang.sidebar` entry if it can be added in edit mode; CSS in `dashboards.css`; TypeDoc entry points; docs page and `docs/sidebars.js`; sample; Playwright test.
- Component methods: `render()` calls `super.render()`, builds the content, calls `this.sync.start()` and emits `afterRender`; `update()` emits `afterUpdate`, which restarts sync; `getOptions()` includes `type`; `destroy()` removes what the component added.
- New editable option: an `editableOptions` entry whose `propertyPath` the component's `update` handles, a readable value in `getEditableOptions` or `getEditableOptionValue`, and a lang key for its name ([layout.md](layout.md#edit-mode)).
- New connector type: `registerType` and the `DataConnectorTypes` declaration in `ts/Data`; imports in the Dashboards, Grid and `ts/masters/modules/data-tools.src.ts` masters; a `SerializeHelper/<Name>ConnectorHelper.ts` imported by the master, with a node test; docs.

## Gotchas

- `options.events` handlers are registered as component listeners. `afterLoad` fires twice for Highcharts, HTML and Navigator (once from `Bindings`, once from `load()`).
- The default `chartID` and `gridID` are computed once at load, so every instance gets the same element id unless its options set one.
- `merge` doesn't copy arrays: `editableOptions` and other option arrays are shared with the defaults, and `EditableOptions.getOptions` fills them in place.
- Several sync and extremes paths read `connectorHandlers[0].connector.getTable()`, the first table, ignoring `dataTableKey`; highlight and visibility use `getDataTable`, which honors it.
