# Grid

Guide for Grid Lite and Grid Pro: `ts/Grid`, with masters in `ts/masters-grid`. Rules first, then a map. Read this, then only the files for your task.

## Rules

### Bundles and size

- `grid-lite.src.ts`: `ts/Grid/Core`, Lite credits and the local data provider. `grid-pro.src.ts`: the same, plus the remote data provider and every `ts/Grid/Pro` feature, attached by `compose()` calls in a fixed order.
- Both bundles are self-contained, output to `code/grid/`. They inline `ts/Data`, `ts/Shared` and the `ts/Core` files listed in [../shared.md](../shared.md).
- `ts/Grid/Core` ships in both, so it is Grid's main bundle. The PR size table covers `grid-lite.src.js` and `grid-pro.src.js`.
- Measure before and after: `npx gulp scripts --product Grid`, then `npx gulp write-file-sizes --files grid/grid-lite.src.js,grid/grid-pro.src.js --filename after.json`. Gzip bytes land in `tmp/filesizes/after.json`; build master the same way for the baseline.
- Core never imports Pro. The Grid Lite npm package drops `Grid/Pro`, and no check catches such an import. Core already reads a few Pro members through optional chaining (`validator?.errorCell`, `cellEditing`, `cells.editMode`, `credits`); don't add more, fire an event instead.

### Where code goes

The levels from SKILL.md, for Grid:

1. Existing options, events or API can do it: write a demo or docs.
2. The Core class that owns the behavior; for a Pro feature, its folder in `ts/Grid/Pro/`.
3. A new Pro feature: `ts/Grid/Pro/<Feature>/<Feature>Composition.ts` with a `compose()` guarded by `pushUnique(Globals.composed, '<Feature>')`, hooking Core events with `addEvent`, called from `grid-pro.src.ts`.
4. New logic in `ts/Grid/Core`: only if Lite needs it too and no hook can do it. Whether a new feature is Lite or Pro is a product decision: ask.

If a Pro feature needs Core to behave differently, fire an event in Core and handle it in the composition. Events Core fires: [lifecycle.md](lifecycle.md#events-core-fires).

### Code

- Grid is not in the ES5 build, but the shared files it bundles are.
- DOM: `makeHTMLElement` in `GridUtils.ts`. Class names come from `Globals.getClassName(key)` (prefix `hcg-`; add keys to `rawClassNames`). Style them in `css/grid/` with the `--hcg-*` variables; Pro-only styles go in the Pro CSS files that `grid-pro.css` imports. There is no styled mode.
- HTML from options or data: `setHTMLContent` in `GridUtils.ts` (AST if the string contains `<`, text otherwise). URLs from options pass `AST.filterUserAttributes`. Templates use `Templating.format` with a cell or column context.
- Strings: `defaultLangOptions` in `Core/Defaults.ts`, typed by `LangOptions` in `Core/Options.ts`. Pro features merge their own lang defaults in `compose()`. No hard-coded English.
- Options: types with doc comments in `Core/Options.ts` or the feature's options file; a Pro feature adds its options with `declare module '../../Core/Options'`. Runtime defaults go in `Core/Defaults.ts` or are merged in `compose()`.
- Doc comments: `@default`, and `@sample grid-lite/<category>/<name>` or `grid-pro/…`. Grid doesn't use `@since`. `@internal` or `@private` hides a member from the API docs. ESLint requires a doc comment, with descriptions, on every function and parameter.
- API reference: options come from doc comments (`tools/api-docs/grid-options.ts`, which marks everything under `ts/Grid/Pro` as Pro); classes come from TypeDoc with hand-kept entry points in `tools/gulptasks/grid/api-docs.json`; root options are listed by hand in `tools/gulptasks/grid/api-docs.md`. Build and serve: `npm run gapi`.
- Deprecating an option: `@deprecated <version>` and `@deprnote`, a runtime fallback at the use site, then regenerate `Core/DeprecatedOptionsMetadata.ts` with `npx gulp grid/deprecated-options` (`npm run gcode` also runs it). Don't edit the metadata by hand.

### Tests

- Playwright specs in `tests/grid/`: `grid-lite/` for Lite-only behavior, `grid-pro/` for Pro features, `shared/` for Core behavior, with one spec per option in `shared/options/`. A spec tests the bundle whose page it opens; open both a Lite and a Pro page when the behavior may differ. Extend an existing spec.
- A spec either opens a sample page, `page.goto('/grid-pro/e2e/<name>/')`, served from `samples/grid-pro/e2e/<name>/`, or builds one with `page.setContent()` and a `https://code.highcharts.com/grid/grid-lite.js` script, which the fixtures map to `code/grid/`. Wait for `Grid.grids`, then assert on the DOM or through `page.evaluate()`.
- One file: `npx playwright test tests/grid/shared/<file>.spec.ts --project=grid-shared` (or `grid-lite`, `grid-pro`). The setup projects rebuild Grid when sources changed; the Grid Pro setup also builds Highcharts, for sparklines.
- All: `npm run gtest`. Node unit tests: `test/ts-node-unit-tests/tests/Grid/`, run by `npm run test-node`.
- The Dashboards Grid component uses Grid APIs at runtime ([list](../shared.md#apis-used-across-products-at-runtime)). After changing one, also run `npm run dtest`.
- `test/cypress/grid/` is legacy; CI runs only its Lighthouse tests. Add tests to Playwright.

### Samples and docs

- `samples/grid-lite/` and `samples/grid-pro/`, with `basic`, `demo`, `e2e` (test pages), `options` and `studies` folders; Pro also has `accessibility` and `tree-view`. `demo.html` loads the Grid bundle and `demo.css` imports its CSS, both from jsDelivr; `demo.js` calls `Grid.grid('container', {…})`. `npx gulp test-docs` checks that `@sample` paths exist.
- Docs in `docs/grid/`, sidebar in `docs/sidebars.js`.

### Commands

Build `npm run gcode`. Type-check `npx tsc -p ts/masters-grid --noEmit`. Lint `npm run glint` (not run in CI) and `npx stylelint --config css/.stylelintrc.json "css/grid/*.css"`.

### Changelog

Label the PR `Product: Highcharts Grid`, and also `Grid Pro` for Pro-only changes.

## Key facts

1. Rendering is async. `Grid.grid()` returns before the table exists; `Grid.grid(…, true)` returns a promise, as do `update()` and `redraw()`. Redraws are queued.
2. `update()` diffs the options and sets dirty flags. Keys without a cheaper path cause a full re-render with a new data provider and a new table ([lifecycle.md](lifecycle.md)).
3. Data always goes through a data provider. `LocalDataProvider` runs sorting, filtering and pagination as `ts/Data` modifiers on a copy of the table; the Pro `RemoteDataProvider` fetches rows from a server.
4. The table is virtualized: only visible rows, and optionally columns, are rendered, and row objects are pooled and reused.
5. Pro features attach through events that Core fires and a few hook slots on `Table` and `RowsVirtualizer`. Listeners run in the order of the `compose()` calls in `grid-pro.src.ts`, unless one passes `addEvent`'s `order` option.

## Layout of ts/Grid

| Path | Contents |
|---|---|
| `Core/Grid.ts` | Grid class: factory, options, update, redraw, render, destroy, sorting API |
| `Core/Options.ts`, `Defaults.ts`, `DeprecatedOptions*.ts` | option types, defaults and lang, deprecation warnings |
| `Core/Globals.ts`, `GridUtils.ts` | class names, `composed`; DOM, HTML and style helpers |
| `Core/Table/` | `Table` (the viewport), `Column`, `Row` and `Cell` bases, `Body/` rows and cells, `Header/` with the column toolbar, `CellContent/`, `ColumnResizing/`, `Layout/`, `Actions/` (virtualizers, sorting, filtering, resizer), `CellContextMenu/` |
| `Core/Data/`, `Core/Querying/` | data providers; sorting, filtering and pagination controllers |
| `Core/Pagination/`, `Responsive/`, `Accessibility/`, `UI/` | pagination UI, responsive rules, a11y, popups, menus and buttons |
| `Core/ColumnPolicyResolver.ts`, `Credits.ts` | per-column options and capabilities; credits |
| `Lite/`, `Pro/` | Lite credits; one folder per Pro feature |
| `index.ts` | type exports for Dashboards |

## Object model

```
Grid ─ options, userOptions, columnPolicy, time, querying (sorting, filtering, pagination)
  ├─ dataProvider (LocalDataProvider | RemoteDataProvider)
  ├─ pagination, accessibility, popups
  └─ viewport (Table)                          created by render(), replaced on re-render
       ├─ columns[] (Column: options proxy, sorting, filtering, header)
       ├─ header (TableHeader ─ HeaderRow[] ─ HeaderCell + toolbar)
       ├─ rows[] (TableRow ─ TableCell ─ CellContent); bodySections for pinned and summary rows
       └─ rowsVirtualizer, columnsVirtualizer, columnLayout, columnResizing, columnsResizer
```

Pro adds `grid.credits`, `exporting`, `rowPinning`, `tableEditing`, `treeView`, `summaryRows`, and `viewport.cellEditing`, `validator`.

## Read next

| Task | File |
|---|---|
| Creating, updating, redrawing and destroying; option merging, dirty flags, events Core fires | [lifecycle.md](lifecycle.md) |
| Table, columns, rows, cells, header and toolbar, virtualization, widths, formatting, popups, keyboard, a11y | [table.md](table.md) |
| Data providers, sorting, filtering, pagination | [data.md](data.md) |
| Pro features: editing, validation, renderers, events, row pinning, tree view, summaries, export, remote data | [pro.md](pro.md) |
| `ts/Data`, `ts/Shared`, `ts/Core` files Grid bundles; Grid APIs Dashboards uses | [../shared.md](../shared.md) |
