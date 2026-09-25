# Shared code

`ts/Data`, `ts/Shared` and some `ts/Core` files ship in more than one product, so a change here can break a product you didn't touch. Read this, then the guide of each product that ships the file.

## Who ships what

| Files | Highcharts | Grid | Dashboards |
|---|---|---|---|
| `Shared/Utilities`, `Shared/TimeBase`, `Core/{Globals,Utilities,Defaults,Time,Templating}`, `Core/Chart/ChartDefaults`, `Core/Color/PaletteDefaults`, `Core/Renderer/HTML/AST` | core | Lite, Pro | `dashboards.js` |
| `Data/DataTableCore`, `Data/ColumnUtils` | core | Lite, Pro | `dashboards.js` |
| Rest of `Data/`: `DataTable`, `DataPool`, `DataCursor`, connectors, converters, Chain, Filter, Invert, Range and Sort modifiers | `modules/data-tools` | Lite, Pro | `dashboards.js` |
| `Data/Formula/*` | `data-tools` | Pro (aggregation) | processor and 7 functions in `dashboards.js` (KPI); all in `modules/math-modifier` |
| `Data/Modifiers/MathModifier` | `data-tools` | – | `modules/math-modifier` |
| `Shared/DownloadURL` | exporting, export-data, offline-exporting, sonification | Pro (export) | – |
| `Shared/BaseForm*` | annotations popup, stock tools | – | `modules/layout` (edit mode) |
| `Accessibility/HighContrastMode`, `Accessibility/Utils/HTMLUtilities` | `modules/accessibility` | Lite, Pro | – |

Grid and Dashboards bundles are self-contained: each inlines its own copy of these files. `Highcharts.AST`, `Grid.AST` and `Dashboards.AST` are separate objects in the classic builds.

## Rules

- Shared files import only other shared files and types. Don't import chart, Grid or Dashboards classes into them.
- They build for ES5 (`ts/masters-es5`): no `for…of` over Map or Set, no `#private` fields, no regex `s` or `u` flags.
- Keep `DataTableCore` methods and event payloads (`rowIndex`, `rowCount`) stable. `Series.bindDataTableEvents` reads them, and calls `getRowObject` with a bare `{ columns }` as `this`.
- New export in `Shared/Utilities.ts` or `Core/Utilities.ts` that other bundles use: add `G.x = x` in `ts/masters/highcharts.src.ts`, and in `ts/masters-dashboards/dashboards.src.ts` if Dashboards modules use it. `npm run test:webpack` checks only the Highcharts master for this.
- Code that copies keys from options, data or JSON skips `__proto__` and `constructor`, as `merge`, `extend`, `DataTableCore.setRow` and the Dashboards `deepClone` do; code that walks dotted key paths also rejects `prototype`.
- Doc comments in shared code keep JSDoc types (`@param {number}`), because the Highcharts doclet tooling reads them. Grid and Dashboards code leaves them out.
- AST allowlists apply to everything in a bundle. Grid adds `srcset`, `media`, `picture` and `source` at load; the Dashboards HTML component adds form tags, `src` and `data:image/`. Treat allowlist changes as security changes.

## Checks

- Type-check each product that ships the file: `npx tsc -p ts/masters-grid --noEmit`, `npx tsc -p ts/masters-dashboards --noEmit` (also covers `ts/Grid`) and `npx tsc -p ts/masters-es5 --noEmit`. `tsc -p ts` skips Grid and Dashboards.
- Tests: `npm run test-node`, the Highcharts tests for the area, `npm run gtest` and `npm run dtest`. `gulp test --modified` looks at staged files only, and maps `ts/Data` and `ts/Shared` to Highcharts and Dashboards, not Grid. CI runs the Grid and Dashboards tests for `ts/Data` changes, not for `ts/Shared` or `ts/Core`.
- `npm run dtest` loads Highcharts from `code/` without rebuilding it: run `npx gulp scripts` first. The Grid Pro test setup rebuilds Highcharts itself.

## Data layer (`ts/Data`)

- `DataTableCore`: column store behind `series.dataTable` and `chart.dataTable`. `setRow` (skips unsafe keys), `setColumn(s)`, `deleteRows`, `getModified()`. Fires `afterSetRows`, `afterDeleteRows`, `afterSetColumns`. In core, `Highcharts.DataTable` is `DataTableCore`.
- `DataTable` extends it with cells, rows, events (`setCell`, `setRows`, `deleteRows`, `setColumns`, `deleteColumns`, `setModifier`, each with an `after*` event), original and local row indexes, and a modifier. Every mutation re-runs the modifier synchronously into `table.modified`; `setModifier` is async.
- Modifiers: `DataModifier.types`, filled by importing each file. `modify(table)` is async, `modifyTable(table)` sync. Chain, Filter (compiled condition callbacks), Invert, Math (formula columns), Range, Sort.
- Connectors and converters: CSV, JSON, Google Sheets and HTML table, registered in `DataConnector.types`. `load()` fetches and converts into one table per `dataTables` entry, or one table with the connector id. A table's `dataModifier` overrides the connector's. Polling: `startPolling`, `stopPolling`; Google Sheets also runs its own timer.
- `DataPool`: connector instances by id, created lazily by `getConnector(id)` and shared between concurrent callers. Dashboards only.
- `DataCursor`: position and range cursors, with listeners keyed by table id and state string. Dashboards sync only.
- `Formula/`: parser, processor and functions for `MathModifier`, KPI formulas and Grid Pro aggregation.
- Separate from `modules/data` (`ts/Extensions/Data.ts`), the classic CSV, HTML table and Google Sheets parser for charts.
- Series accept a table by reference (`isDataTable` flag, not `instanceof`) and listen to its events in `Series.bindDataTableEvents`.
- Tests: `test/ts-node-unit-tests/tests/Data/`, `samples/unit-tests/datatable/`, `tests/dashboards/*-connector.spec.ts`.

## Shared (`ts/Shared`)

| File | Used by |
|---|---|
| `Utilities.ts` | all products |
| `TimeBase.ts` | `Core/Time`, Grid |
| `DownloadURL.ts` | exporting, export-data, offline-exporting, sonification, Grid Pro export |
| `BaseForm*.ts` | annotations popup, stock tools, Dashboards edit mode |
| `Types.d.ts`, `LangOptionsCore.d.ts` | types everywhere |

## APIs used across products at runtime

Dashboards drives charts and grids through their APIs, and Grid Pro sparklines create charts, so changing these can break another product although no file is shared. After changing one, run `npm run dtest`, and `npm run gtest` for the chart factory and `chart.update` or `destroy`:

- Highcharts: the `Chart.chart`, `stockChart`, `mapChart` and `ganttChart` factories; `chart.update`, `redraw`, `setSize`, `addSeries`, `get`, `destroy`, `zooming`, `showResetZoom`, `zoomOut`, `navigator`; `series.update`, `setData`, `setVisible`, `destroy`; `point.update`, `setState`; `pointer.getHoverData`; `tooltip.refresh`, `hide`; `axis.setExtremes`, `getExtremes`, `drawCrosshair`; the `afterSetExtremes` event and its `trigger`.
- Grid: the `Grid` constructor, `update`, `redraw`, `getOptions`, `renderViewport`, `destroy`, `updateColumn`, `syncRow`, `syncColumn`; `viewport.updateRows`, `reflow`, `scrollToRow`; `querying.shouldBeUpdated`, `enabledColumns`, `columnPolicy.getIndividualColumnOptions`, `dataProvider.getDataTable`; the Grid Pro `cellMouseOver` and `cellMouseOut` events.
