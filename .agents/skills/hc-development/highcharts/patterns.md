# How code attaches

Core is small; everything else composes onto its classes.

## Composition

```ts
export function compose(
    AxisClass: typeof Axis,
    ChartClass: typeof Chart
): void {
    if (pushUnique(composed, 'MyFeature')) { // Once per page
        addEvent(AxisClass, 'afterSetOptions', onAxisAfterSetOptions);
        ChartClass.prototype.myMethod = chartMyMethod;
        setOptions({ myFeature: MyFeatureDefaults });
    }
}
```

- The master calls it: `MyFeature.compose(G.Axis, G.Chart)`.
- `composed` is `H.composed` from `ts/Core/Globals.ts`.
- Add types and options with `declare module`, e.g. `declare module '../Core/Chart/ChartBase' { interface ChartBase {…} }` and `declare module '../Core/Options' { interface Options {…} }`.
- Prefer `addEvent`; use `wrap` only when no event fits.
- `addEvent(SeriesClass, …)` fires for every series type; check the type or the feature's options in the handler.

## Hooks core fires

`fireEvent(obj, 'name', args, defaultFn)` runs listeners, then `defaultFn` unless a listener calls `args.preventDefault()` or returns `false`.

- Chart: `init`, `afterInit`, `afterGetContainer`, `afterCreateAxes`, `afterLinkSeries`, `beforeRender`, `beforeMargins`, `getMargins`, `afterSetChartSize`, `afterDrawChartBox`, `afterLayOutTitles`, `render`, `load`, `beforeRedraw`, `predraw`, `redraw`, `update`, `afterUpdate`, `addSeries`, `afterAddSeries`, `selection`, `pan`, `transform`, `beforeShowResetZoom`, `afterShowResetZoom`, `resize`, `endResize`, `destroy`
- Axis: `init`, `afterInit`, `afterSetOptions`, `afterSetType`, `getSeriesExtremes`, `afterGetSeriesExtremes`, `foundExtremes`, `postProcessData`, `afterSetTickPositions`, `trimTicks`, `afterTickSize`, `afterSetScale`, `initialAxisTranslation`, `afterSetAxisTranslation`, `afterGetOffset`, `afterRender`, `setExtremes`, `afterSetExtremes`, `drawCrosshair`, `afterDrawCrosshair`, `afterHideCrosshair`, `getPlotLinePath`, `update`, `destroy`
- Series: `init`, `afterInit`, `setOptions`, `afterSetOptions`, `bindAxes`, `afterBindAxes`, `updatedData`, `afterProcessData`, `afterGeneratePoints`, `afterGetExtremes`, `afterTranslate`, `render`, `afterRender`, `afterAnimate`, `afterDrawTracker`, `getPlotBox`, `update`, `afterUpdate`, `addPoint`, `remove`, `show`, `hide`, `mouseOver`, `mouseOut`, `destroy`; data labels: `initDataLabelsGroup`, `drawDataLabels`, `beforeAddingDataLabel`, `afterDrawDataLabels`
- Point: `afterInit`, `afterSetState`, plus user events via `firePointEvent` (`click`, `select`, `update`, `remove`, `mouseOver`, …)
- Pointer: `afterInit`, `beforeGetHoverData`, `afterGetHoverData`, `getSelectionBox`, `getSelectionMarkerAttrs`
- Tooltip: `getAnchor`, `headerFormatter`, `refresh`
- Legend: `afterGetAllItems`, `afterColorizeItem`, `afterPositionItem`, `afterRender`, `afterScroll`, `afterUpdate`
- Tick: `init`, `labelFormat`, `afterGetPosition`, `afterGetLabelPosition`, `afterRender`
- SVGElement: `afterInit`, `afterGetBBox`, `complexColor`

Most hooked: Chart `render`, `redraw`, `destroy`, `beforeRender`, `beforeRedraw`, `load`; Axis `init`, `afterInit`, `afterSetOptions`, `afterRender`; Series `afterRender`, `afterTranslate`, `afterInit`.

## Series types

```ts
class XSeries extends ColumnSeries {
    public static defaultOptions = merge(
        ColumnSeries.defaultOptions,
        XSeriesDefaults
    );
    public translate(): void {
        super.translate();
        // …
    }
}
interface XSeries {
    pointClass: typeof XPoint;
}
extend(XSeries.prototype, { pointClass: XPoint });
declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        x: typeof XSeries;
    }
}
SeriesRegistry.registerSeriesType('x', XSeries);
```

- Get a parent from another bundle via `SeriesRegistry.seriesTypes.column`, not by import (an import inlines it).
- Non-method prototype values go in `extend(X.prototype, {…})`: flags like `sorted: false`, `pointArrayMap`, `pointValKey`, and borrowed functions like `drawTracker: ColumnSeries.prototype.drawTracker` (see `ScatterSeries.ts`).
- Files: `XSeries.ts`, `XPoint.ts`, `XSeriesDefaults.ts`, `XSeriesOptions.ts` (or `.d.ts`), `XPointOptions.ts`.

## Options

- `ts/Core/Defaults.ts` holds global `defaultOptions` (with `ChartDefaults` and `lang`); `setOptions` merges into it. Classes add their parts: `Axis.ts` adds `xAxis`/`yAxis`, `registerSeriesType` adds `plotOptions.<type>`.
- Modules add defaults in `compose`: `setOptions(XDefaults)` or `extend(defaultOptions, { x: XDefaults })`.
- `userOptions`: what the user passed (used by `update` and export). `options`: merged, always has the defaults; don't re-default with `pick(options.x, default)`.
- A public option needs a typed, documented member in `*Options.ts`, a default or an `@apioption` doclet in `*Defaults.ts`, `@since next` and a `@sample`. API docs and the shipped `.d.ts` come from doclets, not TS types. See `ts/DOCLETS.md`.
- Options that load a module are mapped in `ts/Extensions/Autoload/DependencyMapping.ts` (`npx gulp dependency-mapping`).

## Utilities

- `ts/Shared/Utilities.ts`: generic helpers, shared with Grid and Dashboards (`addEvent`, `fireEvent`, `merge`, `pick`, `defined`, `isNumber`, `extend`, `splat`, `objectEach`, `attr`, `css`, `createElement`, `crisp`, `clamp`, `correctFloat`, `pushUnique`, `relativeLength`, `wrap`…). Look here before writing a helper.
- `ts/Core/Utilities.ts`: `error`, `insertItem`, `timeUnits`, `uniqueKey`; also used by Data, Grid and Dashboards.
- Narrow-audience helpers live next to their users: `Core/Renderer/RendererUtilities.ts`, `Core/Animation/AnimationUtilities.ts`, `Core/Geometry/*`, `Series/*Utilities.ts`.
- `ts/Core/Globals.ts`: `win`, `doc`, `charts`, `composed`, `seriesTypes`, feature flags (`isTouchDevice`, `svg`…), `noop`, `deg2rad`.

## Other builds

- ES5: all Highcharts, `Data/` and `Shared/` code also compiles with `target: es5` (`ts/masters-es5/`). No `for…of` or spread over Map, Set or other iterables, no `#private` fields, no regex `s` or `u` flags. Array `for…of`, `?.`, `??` and object spread are fine. Check with `npx tsc -p ts/masters-es5 --noEmit`.
- Grid and Dashboards bundle `Shared/*`, `Data/*`, `Core/{Globals,Utilities,Defaults,Time,Templating}` and `Core/Renderer/HTML/AST`. Don't import chart classes into these files. After changing them, run `npx tsc -p ts/masters-dashboards --noEmit` (covers Grid). See [../shared.md](../shared.md).

## Styled mode, errors, lang

- Styled mode (`chart.styledMode`): no presentational attributes; set fill, stroke and style only in `if (!styledMode)` branches. Give every element a `highcharts-*` class and style it in `css/highcharts.css`.
- Errors: `error(code, stop?, chart?, params?)` from `Core/Utilities.ts`; texts in `errors/<code>/` and `errors/errors.json`.
- Lang: core strings in `lang` in `Core/Defaults.ts`, module strings in the module's defaults, a11y strings in `Accessibility/Options/LangDefaults.ts`. A changed string also goes in `i18n/highcharts/lang.json` and translations; `npx gulp lang-build` regenerates `ts/masters/i18n/*`.
