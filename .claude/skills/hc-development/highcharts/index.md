# Highcharts

Guide for Highcharts, Stock, Maps and Gantt: the rules that apply only to them, then a map of their code in `ts/`. Read this, then only the files for your task.

## Rules

### Core size

- Core is what `ts/masters/highcharts.src.ts` bundles, not the `ts/Core/` folder.
- `highcharts.js` must stay under 100 kB min+gzip and is at the limit. Every byte counts.
- When changing core, measure before and after ([how](bundles.md#measuring-size)) and report the delta.

### Where code goes

The levels from SKILL.md, for charts:

1. Existing options, events or `addEvent` can do it: write a demo or docs.
2. A module owns the area (a series type, `ts/Extensions`, `ts/Stock`, `ts/Maps`, `ts/Gantt`, `ts/Accessibility`): put it there.
3. A new module that composes onto core classes ([patterns.md](patterns.md)).
4. Core: only if nearly every chart needs it and no hook can do it.

If a module needs to change core behavior, add a `fireEvent` hook to core and keep the logic in the module. A bug that shows only with one module or series type is fixed in that module or type.

### Code

- Highcharts, `ts/Data` and `ts/Shared` code also builds for ES5: no `for…of` over Map or Set, no `#private` fields, no regex `s` or `u` flags ([details](patterns.md#other-builds)).
- Styled mode: set fill, stroke and style only when `!chart.styledMode`. Add `highcharts-*` class names and style them in `css/highcharts.css`.
- Doclets: a new public option or member gets `@since next` and a `@sample`. API docs and the shipped `.d.ts` come from doclets, not TS types, so options need both. See `ts/DOCLETS.md`.
- New series type: [series/adding.md](series/adding.md) and the checklist in `repo-guidelines.md`.

### Tests

- Extend an existing QUnit test in `samples/unit-tests/<area>/` and reuse its chart. Playwright specs for what QUnit can't do go in `tests/highcharts/<area>/`.
- One test: `QUNIT_TEST_PATH=unit-tests/<area>/<test> npx playwright test --project=qunit`. A whole area: `QUNIT_TEST_PATH='unit-tests/<area>/*'` the same way, and `npx playwright test tests/highcharts/<area> --project=highcharts`.
- `npx gulp test --modified` selects tests from staged files only, by product names in their paths; most `ts/Series` and `ts/Extensions` changes select nothing. Run the area's tests directly.
- Dashboards and Grid Pro sparklines call chart APIs at runtime ([list](../shared.md#apis-used-across-products-at-runtime)). After changing one, run `npx gulp scripts`, `npm run dtest` and `npm run gtest`.
- More: `test/readme.md`, `tests/AGENTS.md`.

### Commands

Build `npx gulp scripts`. Type-check `npx tsc -p ts --noEmit`, and `npx tsc -p ts/masters-es5 --noEmit` for the ES5 limits. Lint changed files: `cd ts && npx eslint --quiet <files>`.

### Samples

- Follow `samples/README.md`.
- Load the accessibility module unless there is a concrete reason not to. Cover the chart type description, axis titles and keyboard navigation.
- Check the layout at 320px wide.

### Changelog

Label Stock, Maps and Gantt PRs `Product: Highcharts Stock`, `Product: Highcharts Maps` or `Product: Highcharts Gantt`. Unlabeled PRs go into the Highcharts changelog.

## Five facts

1. Bundles are defined by `ts/masters/**`. Core is `highcharts.js`.
2. Directory is not bundle: `ts/Core/Axis/RadialAxis.ts` ships in highcharts-more, `ts/Extensions/BorderRadius.ts` in core. See [bundles.md](bundles.md).
3. Features attach to core classes by composition: `compose()` plus `addEvent` on events core fires. See [patterns.md](patterns.md).
4. Options come in pairs: `*Defaults.ts` (runtime defaults and API doclets) and `*Options.ts` (TS types).
5. Behavior is spread out: series types inherit most logic, and data labels, tooltips and animation are overridden in many files. Check [feature-map.md](feature-map.md) before changing shared code.

## Layout of ts/

| Directory | Contents | Ships in |
|---|---|---|
| `Core/` | Chart, Axis, Series, Point, Pointer, Tooltip, Legend, renderer, Time, Templating, Defaults, Globals | Mostly core; chart variants, extra axis types and 3D in modules |
| `Series/` | One folder per series type; shared `*Composition.ts` and `*Utilities.ts` | 8 types in core, the rest in highcharts-more, highcharts-3d or modules |
| `Extensions/` | Optional features: exporting, boost, drilldown, annotations… | Modules; `BorderRadius` and `ScrollablePlotArea` in core |
| `Stock/` | Navigator, range selector, scrollbar, stock tools, indicators | `modules/stock`, `stock-tools`, `indicators/*` |
| `Maps/` | MapView, projections, GeoJSON, map navigation | `modules/map` and map add-ons |
| `Gantt/` | Pathfinder connectors, tree | `modules/gantt`, `pathfinder` |
| `Accessibility/` | Screen reader and keyboard support | `modules/accessibility` |
| `Data/` | `DataTableCore` (core); DataTable, connectors, modifiers | core, `data-tools`, Grid, Dashboards |
| `Shared/` | `Utilities`, `TimeBase`, shared by all products | everywhere |
| `masters/` | Bundle definitions | |

`Grid/` and `Dashboards/` are separate products with their own guides.

## Read next

| Task | File |
|---|---|
| Which bundle ships a file, shared code, adding a module, measuring size | [bundles.md](bundles.md) |
| Hooks, options, series classes, utilities, ES5 build, styled mode, lang | [patterns.md](patterns.md) |
| Chart lifecycle, redraw, update, size, responsive, options | [core/chart.md](core/chart.md) |
| Pointer events, hover, tooltip, zoom, pan, legend | [core/interaction.md](core/interaction.md) |
| Axes, ticks, labels, plot bands, stacking | [core/axis.md](core/axis.md) |
| Series data, points, markers, states, zones | [core/series.md](core/series.md) |
| Data labels | [core/data-labels.md](core/data-labels.md) |
| SVG, text, HTML labels, animation, color, format strings, time | [core/renderer.md](core/renderer.md) |
| A series type or family, polar, 3D | [series/index.md](series/index.md) |
| Stock, Maps, Gantt, accessibility, other modules | [modules/index.md](modules/index.md) |
| A feature spread over many files | [feature-map.md](feature-map.md) |
| `ts/Data`, `ts/Shared`, or a `Core` file that Grid or Dashboards also bundle | [../shared.md](../shared.md) |

Overview of core: [core/index.md](core/index.md).
