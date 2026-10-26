# Chart

## Files

- `Core/Chart/Chart.ts`: `Chart.chart` factory; init, render, redraw, update, setSize, reflow, destroy; margins (`getMargins`, `getAxisMargins`, `setChartSize`, `drawChartBox`); titles (`setTitle`, `layOutTitles`); credits; loading; zoom and pan (`transform`, `pan`, `zoomOut`, `showResetZoom`); `addSeries`, `addAxis`, `isInsidePlot`.
- `Core/Chart/ChartDefaults.ts`: `chart.*` defaults and doclets. Types in `ChartOptions.ts`.
- `Core/Defaults.ts`: `defaultOptions` (lang, time, title, subtitle, caption, legend, loading, tooltip, credits), `setOptions`, `getOptions`. Types in `Core/Options.ts`.
- `Core/Responsive.ts`: `responsive.rules`, applied through `chart.update`.
- `Extensions/ScrollablePlotArea.ts`: scrolling plot area. In core.
- `Core/Foundation.ts`: `registerEventOptions` turns `options.events` into listeners for Chart, Axis, Series and Legend.
- Not core: `Chart/StockChart.ts`, `MapChart.ts`, `GanttChart.ts` (subclasses, plus the `stockChart`/`mapChart`/`ganttChart` factories), `Chart3D.ts` (3d), `ChartNavigationComposition.ts` (exporting, annotations).

## Flows

- Create: `init` fires `init` (the data module cancels it and re-inits after parsing), merges `defaultOptions` and `userOptions`, creates `Time`, registers event options, fires `afterInit`. `firstRender`, `render`: see [index.md](index.md).
- `render` also runs `setTitle` → `layOutTitles` (fires `layOutTitle` per title, then `afterLayOutTitles`) and fires `beforeMargins`.
- `redraw` fires `beforeRedraw`, then runs `setResponsive(false)` and `layOutTitles(false)`. The legend renders only if `isDirtyLegend` is set or a dirty series needs it.
- `update(options, redraw, oneToOne, animation)`:
  1. `diffObjects` against `chart.options`; fires `update`; stops if nothing changed.
  2. Undoes responsive rules; merges into `userOptions`.
  3. `chart` key: zoom options, class name; `inverted`, `polar` or `type` → `propFromSeries` and update all axes; `propsRequireDirtyBox`, `propsRequireReflow`, `propsRequireUpdateSeries` set flags.
  4. Other keys: `chart[key].update(value, false)` if it exists (legend, tooltip, credits, time, navigator, exporting…), else a setter (`setTitle`…), else merge into `chart.options`.
  5. Collections in `collectionsWithUpdate` (axes, series, colorAxis, annotations…): matched by `id`, then index; `oneToOne` adds and removes.
  6. `setSize` if size, margin or spacing changed, else `redraw`. Fires `afterUpdate`.
- Size: `setSize` resizes container and renderer, rescales axes, dirties box and legend, redraws, fires `resize` then `endResize`. Reflow: a ResizeObserver on `renderTo` calls `reflow` → `setSize` if `getContainerBox()` changed.
- `destroy`: fires `destroy`, removes events, destroys axes, series, legend, tooltip, renderer, then empties the container.
- Global options: `setOptions` merges into `defaultOptions`; charts read defaults only in `init`.

## Extension points

- Hooked chart events: `init` (3D, polar, data), `afterGetContainer`, `beforeRender` (pointer, navigator, range selector, map navigation), `afterCreateAxes` (color axis, z axis), `afterLinkSeries` (indicators, derived series), `getMargins` (navigator, range selector, breadcrumbs reserve space), `afterSetChartSize`, `layOutTitle` (exporting), `load`, `render` (most modules), `beforeRedraw`, `predraw` (boost), `redraw`, `update`, `destroy`.
- Prototype arrays modules push to: `callbacks` (run on load), `collectionsWithInit` and `collectionsWithUpdate` (option arrays with their own class), `propsRequireDirtyBox`, `propsRequireReflow`, `propsRequireUpdateSeries`, `ScrollablePlotArea.fixedSelectors`.
- Chart variants override `init` (plus `createAxis` for stock, `update` for map). 3D uses `wrap`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Wrong size in hidden, flex or 100%-height container; reflow loop | `Chart::getChartSize`, `getContainerBox`, `reflow` | `temporaryDisplay`, `setReflow` |
| Double redraw on resize; no resize after fullscreen | `Chart::setSize` | `Extensions/Exporting/Fullscreen.ts` |
| `chart.update` ignored or partly applied | `Chart::update`, `propsRequire*` arrays | the target object's own `update` |
| Collection update hits the wrong item | `Chart::update` collections block | `diffObjects`, `orderItems` |
| Title, subtitle or caption layout | `Chart::layOutTitles`, `applyDescription` | `getMargins`, exporting `layOutTitle` |
| Responsive rule not applied or not undone | `Responsive::setResponsive` | `Chart::update`, `diffObjects` |
| Scrollable plot area layout | `ScrollablePlotArea` `afterSetSize`, `applyFixed` | `fixedSelectors`, tooltip `outside` |
| Margins or plot box wrong | `Chart::getMargins`, `setChartSize` | `Axis::getOffset`, legend `adjustMargins` |

Zoom, pan, hover, tooltip and legend: see [interaction.md](interaction.md).

## Must change together

- New chart option: default and doclet in `ChartDefaults.ts`, type in `ChartOptions.ts`. If a runtime change must reflow, dirty the box or rebuild series, add it to the matching `propsRequire*` array.
- New chart-owned object: needs `update(options, redraw)` merging into `chart.options[key]`.
- New option array (like `annotations`): push to `collectionsWithInit` and `collectionsWithUpdate`.

## Core vs module

Chart variants set their defaults in their own `init`, not in core. Mouse-wheel zoom, non-cartesian zoom, no-data message, fullscreen and export menu are modules hooked on chart events; core only gains a `fireEvent`, a `propsRequire*` entry or a `fixedSelectors` entry.

## Gotchas

- `chart.pointer` is created on `beforeRender`, `chart.tooltip` on Pointer `afterInit` (only if `options.tooltip`), `chart.legend` on `beforeMargins`; Chart `init`/`afterInit` handlers can't use them.
- `update` handlers get the diff, not the full options. Objects with their own `update` merge into the shared options themselves.
- Every user `update` undoes responsive rules and `redraw` re-applies them, so responsive bugs are often `update` or `diffObjects` bugs.
- Stock, Map and Gantt `init` merge their defaults at user-options level, so they override `setOptions` unless they read current defaults.
- Handlers from `options.events` run first; returning `false` skips the default action, silently disabling e.g. the tooltip on `mouseOver`.
