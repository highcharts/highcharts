# Dashboards

Guide for Highcharts Dashboards: `ts/Dashboards`, with masters in `ts/masters-dashboards`. Rules first, then a map. Read this, then only the files for your task.

## Rules

### Bundles and size

- `dashboards.js` (`dashboards.src.ts`): Board, layout classes, all five components and their syncs, the Highcharts and Grid plugins, the data layer (`DataPool`, `DataTable`, `DataCursor`, connectors, modifiers except Math), serialize helpers, AST and Templating. It is the main bundle.
- `modules/layout.js`: edit mode, fullscreen, drag and drop, resizing, sidebar. It also builds the layouts from `gui` options, so boards with a `gui` need it.
- `modules/math-modifier.js`: `Formula` and `MathModifier`.
- Highcharts and Grid are not bundled. They are connected at runtime through `HighchartsPlugin` and `GridPlugin`. Import them as types only (`ts/Dashboards/highcharts.d.ts`, `Plugins/HighchartsTypes.ts`, `Plugins/GridTypes.ts`).
- The PR size table covers `dashboards.src.js` and `modules/layout.src.js`. Measure before and after: `npx gulp scripts --product Dashboards`, then `npx gulp write-file-sizes --files dashboards/dashboards.src.js,dashboards/modules/layout.src.js --filename after.json`. Gzip bytes land in `tmp/filesizes/after.json`; build master the same way for the baseline.

### Where code goes

The levels from SKILL.md, for Dashboards:

1. Existing options, events, a custom sync or a custom component can do it: write a demo or docs.
2. The component (`Components/<Name>Component/`) or its syncs (`<Name>Syncs/`) that owns the behavior. Edit-mode behavior goes in `EditMode/` or `Actions/`, which ship in the layout module.
3. A new module, like `modules/math-modifier`.
4. `Board`, `Layout/`, the `Component` base class or `Sync`: only if every board or component needs it. `ts/Data` is on this level too, and ships in Grid and Highcharts `data-tools` as well ([../shared.md](../shared.md)).

A problem in how Dashboards drives a chart or a grid is fixed in the component or sync, not in Highcharts or Grid, unless their API is wrong on its own.

### Code

- Dashboards is not in the ES5 build, but the shared files it bundles are.
- DOM: `createElement` and `css` from `ts/Shared/Utilities.ts`. Class names come from `Globals.classNames` and `EditGlobals.classNames` (prefix `highcharts-dashboards-`). Style them in `css/dashboards/dashboards.css`, which has light and dark variables.
- HTML from options goes through `AST` (`new AST(html).addToDOM(el)`, `AST.setElementHTML`). The HTML component widens the AST allowlists at load (form elements, `src`, `data:image/`).
- Edit-mode strings: `EditGlobals.lang` and its `LangOptions` type.
- Options: board defaults in `Defaults.ts`, component defaults in `Components/<Name>Component/<Name>ComponentDefaults.ts`, types in the `*Options.ts` files and in the classes' namespaces.
- API docs are TypeDoc, built from TS doc comments on the types (`npm run dapi`; entry points in `tools/gulptasks/dashboards/api-docs.json`). Document the type member with a description and `@default`; `@internal` hides it. Don't put types in doc comments, except in shared code ([../shared.md](../shared.md#rules)), and don't use `@since`. See `ts/Dashboards/CONTRIBUTING.md`.
- `merge` doesn't copy arrays, so option arrays can be shared with the defaults. Copy with `deepClone` from `ts/Dashboards/Utilities.ts`.

### Tests

- Playwright specs in `tests/dashboards/`; extend an existing one. A spec calls `page.setContent()` with `https://code.highcharts.com/…` script tags, which the fixtures route to the local `code/` build, then creates the board in `page.evaluate()` with `await Dashboards.board('container', options, true)`. Load Highcharts or Grid before Dashboards, or connect the plugin by hand. `/dashboards/cypress/<name>` serves `samples/dashboards/cypress/<name>/` as a page.
- One file: `npx playwright test tests/dashboards/<file>.spec.ts --project=dashboards`. The setup project rebuilds Dashboards and Grid, not Highcharts: run `npx gulp scripts` first.
- All: `npm run dtest`. Serialize helpers have node tests in `test/ts-node-unit-tests/tests/Dashboards/`, run by `npm run test-node`.
- `test/cypress/dashboards/` is legacy; CI runs only its visual and Lighthouse tests. Add tests to Playwright.

### Samples and docs

- Samples in `samples/dashboards/<category>/<name>/`. `demo.html` loads what the sample uses before `dashboards.js`: Highcharts or Stock for chart, KPI and navigator components, Grid Pro for a Grid component. Add `modules/layout.js` for `gui` layouts or edit mode. `demo.css` imports `dashboards.css`. `samples/dashboards/cypress/` holds pages for tests.
- Docs in `docs/dashboards/`, sidebar in `docs/sidebars.js`. Option doc comments link samples as "Try it" jsFiddle links.

### Commands

Build `npm run dcode`. Type-check `npx tsc -p ts/masters-dashboards --noEmit`. Lint `cd ts/Dashboards && npx eslint --quiet <files>` (`npm run dlint` also runs `npm i` now and then; CI runs neither) and `npm run dlintcss`.

### Changelog

Label the PR `Product: Highcharts Dashboards`.

## Key facts

1. Highcharts and Grid are runtime dependencies. `window.Highcharts` and `window.Grid` are connected when `dashboards.js` loads if they already exist; otherwise call `HighchartsPlugin.custom.connectHighcharts` or `GridPlugin.custom.connectGrid` and `PluginHandler.addPlugin`. The plugins register the `Highcharts`, `KPI`, `Navigator` and `Grid` component types; without them those types are unknown.
2. Two modes. GUI: `gui.layouts` builds layouts, rows and cells, which needs the layout module. Custom HTML: components render into existing elements found by their `renderTo` id.
3. Components read tables from connectors in the board's `dataPool`, by connector `id` and optional `dataTableKey`, and re-render on table events.
4. Components sync through `DataCursor`, keyed by table id: two components sync only if they read the same table.
5. `board.update()` rebuilds everything: components, layouts, and the data pool when `dataPool` options change.

## Layout of ts/Dashboards

| Path | Contents |
|---|---|
| `Board.ts` | Board class and the `Dashboards.board()` factory |
| `Layout/` | `Layout`, `Row`, `Cell`, `CellHTML` (custom HTML mode), `GUIElement` base |
| `Components/` | `Component` base, `ComponentRegistry`, `ConnectorHandler`, `EditableOptions`, one folder per component, `Sync/` |
| `EditMode/` | edit mode, sidebar, accordion menu, toolbars, context menu, confirmation popup, fullscreen (layout module) |
| `Actions/` | `Bindings` (mounts components), `DragDrop`, `Resizer`, `ContextDetection` |
| `Plugins/`, `PluginHandler.ts` | Highcharts and Grid plugins |
| `Serializable.ts`, `SerializeHelper/` | JSON helpers for data classes |
| `Defaults.ts`, `Globals.ts`, `Utilities.ts`, `Accessibility/` | defaults, class names, helpers, tab order |

## Object model

```
Board ─ options, container, dataPool (DataPool), dataCursor (DataCursor)
  ├─ layouts[] ─ Layout ─ rows[] ─ Row ─ cells[] ─ Cell ─ mountedComponent or nestedLayout
  ├─ mountedComponents[] = { cell, component, options }
  │    └─ Component ─ connectorHandlers[] (ConnectorHandler ─ DataConnector, DataTable)
  │         └─ sync (Sync ─ emitters, handlers)
  └─ editMode (EditMode, layout module) ─ tools, sidebar (SidebarPopup ─ AccordionMenu), dragDrop, resizer, toolbars
```

## Lifecycle

- `Dashboards.board(renderTo, options, async)`: `new Board()` merges the defaults, creates the `DataPool`, the container, the `EditMode` if the layout module is loaded (it builds `gui.layouts`) and the `DataCursor`. `init()` then mounts each component; with `async` it returns a promise that resolves when all have mounted, after `events.mounted`.
- `Bindings.addComponent`: find the cell by `renderTo` (a GUI cell, or a `CellHTML` around an existing element), look up the type in `ComponentRegistry` (in a GUI cell, an unknown type becomes an HTML component with an error title; in custom HTML mode it throws), construct it, `load()` (connectors, then `render()`), mount it, fire `mount`.
- `Component.load()`: `initConnectors()` gets each connector from `dataPool.getConnector(id)`, which loads it on first use, then `render()`. The base `render()` sets the title, caption and size; each component builds its content, calls `sync.start()` and emits `afterRender`.
- Data change: table events (`afterSetCell`, `afterSetRows`, `afterSetColumns`, `afterDeleteRows`, modifier changes) make the `ConnectorHandler` emit a debounced `tableChanged`, which calls the component's `onTableChanged`.
- `component.update(options)`: fires `update` (sync stops), merges the options, recreates connector handlers if the connector `id` or `dataTableKey` changed, and re-renders.
- `board.destroy()`: cancels connector requests and polling, destroys layouts (GUI) or components (custom HTML), and deletes all properties.

## Read next

| Task | File |
|---|---|
| Component base, connectors, the Highcharts, Grid, KPI, Navigator and HTML components, `getOptions()` JSON, adding a component | [components.md](components.md) |
| Synchronizing components: highlight, extremes, visibility, crossfilter, `DataCursor`, custom syncs | [sync.md](sync.md) |
| Layouts, rows and cells, sizing, edit mode, sidebar and editable options, drag and drop, resizing, fullscreen | [layout.md](layout.md) |
| `ts/Data` connectors, tables and modifiers; Highcharts and Grid APIs Dashboards relies on | [../shared.md](../shared.md) |
