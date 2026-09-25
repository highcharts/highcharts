# Renderer and services

Rendering, text, animation, color, format strings and time.

## Files

Core:

- `Core/Renderer/SVG/SVGRenderer.ts`: element factory (`rect`, `path`, `circle`, `arc`, `g`, `image`, `symbol`, `text`, `label`, `button`), `fontMetrics`, `crispLine`, `getContrast`, shadows, `definition` (defs).
- `Core/Renderer/SVG/SVGElement.ts`: `attr` with setters and getters, `css`, `animate`, `add` (zIndex), `align`, `getBBox`, `clip`, `shadow`, `crisp`, `complexColor` (gradients), `applyTextOutline`, `destroy`.
- `SVG/SVGLabel.ts`: `renderer.label()`: text plus an optional box, padding, anchors, `fill: 'contrast'`.
- `SVG/TextBuilder.ts`: markup to `tspan`s, `<br>`, wrap, ellipsis, `lineClamp`.
- `SVG/Symbols.ts`: marker symbols (`circle`, `square`, `diamond`, `triangle`, `arc`, `callout`…), `renderer.symbols`.
- `HTML/HTMLElement.ts`: `useHTML` labels.
- `HTML/AST.ts`: parses and sanitizes all markup (tag, attribute and URL allowlists). Security boundary. Shared with Grid and Dashboards.
- `RendererUtilities.ts`: `distribute()` (tooltip, legend, pie labels, flags).
- `Core/Animation/Fx.ts` (tweens, path morph) and `AnimationUtilities.ts` (`animate`, `stop`, `animObject`, `setAnimation`, `getDeferredAnimation`).
- `Core/Color/Color.ts` (`parse`, `brighten`, `setOpacity`, `tweenTo`) and `Palette.ts` + `PaletteDefaults.ts` (`--highcharts-*` CSS variables, light and dark).
- `Core/Templating.ts`: `format`, `numberFormat`, `dateFormat`, `helpers`.
- `Shared/TimeBase.ts` (Intl, timezones, `dateFormat`, `parse`, `makeTime`; shared with Grid) and `Core/Time.ts` (adds axis-only `getTimeTicks`).
- `Core/Geometry/GeometryUtilities.ts`; `Extensions/BorderRadius.ts` (rounded columns and pie slices).

Modules: `SVGRenderer3D`, `SVGElement3D`, `Math3D` (3d); `Extensions/TextPath.ts` (textpath, sankey, networkgraph…), `PatternFill.ts` (pattern-fill), `ArrowSymbols.ts` (arrow-symbols, gantt), `Core/HttpUtilities.ts` (data, exporting), `Geometry/PolygonClip` (map), `Geometry/CircleUtilities` (venn).

## Flows

- Renderer: `Chart.getContainer` → `new SVGRenderer(...)` → `<svg class="highcharts-root">`, `<desc>`, `<defs>`; palette in non-styled mode. Fires chart `afterGetContainer`.
- Element: factory → `new SVGElement` (fires `afterInit`) → `attr(hash)`: per key, `<key>Setter` or `setAttribute`; symbol params rebuild `d` → `updateTransform` → `add(parent)` inserts by `zIndex` and builds text.
- Text: `textSetter` → `buildText` → `TextBuilder.buildSVG`: parse with `AST`, map tags to `tspan`s, line height from `fontMetrics`, wrap or ellipsis when `textWidth` is set.
- `useHTML`: `renderer.html()` → div in a `foreignObject`; layout on `add`.
- Animation: `el.animate(params, options)` → `animObject` → per property `new Fx(...).run()` on one rAF loop; path morph via `initPath`.
- Format: `format(str, ctx, owner)`: `{path:fmt}`, sub-expressions, block helpers `{#if}…{else}…{/if}`. Numbers via `numberFormatter`, dates via `owner.time.dateFormat`. Output is sanitized by AST when rendered.
- Colors: `fill`/`stroke` setters → `complexColor` (fires `complexColor`) → gradient in defs.

## Extension points

- Events: SVGElement `afterInit`, `afterGetBBox`, `afterModifyTree`, `beforeAddingDataLabel` (TextPath); SVGRenderer `complexColor` (PatternFill).
- Symbols: assign `SVGRenderer.prototype.symbols.<name>` in `compose` and augment `SymbolTypeRegistry`. Params that must redraw on `attr` go in `SVGElement.symbolCustomAttribs` (BorderRadius does this).
- Setters: `<key>Setter` on the prototype or instance.
- Registries: `AST.allowedTags`, `allowedAttributes`, `allowedReferences` (exporting widens them); `Templating.helpers`; `H.dateFormats` (gantt adds `%E`, `%W`); `Color.parsers`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| SVG wrap, ellipsis, lineClamp | `TextBuilder::modifyDOM`, `truncate` | `SVGElement::css` |
| Line spacing, baseline | `TextBuilder::getLineHeight`, `SVGRenderer::fontMetrics` | `SVGLabel::updateBoxSize` |
| Text outline or contrast | `SVGElement::applyTextOutline`, `SVGRenderer::getContrast` | `DataLabel.ts` |
| useHTML wrap, position, hide, page CSS leaking | `HTMLElement::css`, `updateTransform`, `visibilitySetter` | Axis label width |
| Label box, padding, anchor | `SVGLabel::updateTextPadding`, `updateBoxSize`, `xSetter` | `Symbols::callout`, `Tooltip.ts` |
| Rotated bbox; false overlaps; stale size | `SVGElement::getRotatedBox`, `getBBox`, `getBBoxCacheKey` | `OverlappingDataLabels` |
| Element jumps when aligned | `SVGElement::align`, `reAlign` | `SVGRenderer::alignElements` |
| Arc or circle gaps | `Symbols::arc`, `circle` | |
| Rounded corners | `BorderRadius` | polar, solid gauge |
| Tag or attribute dropped (error 33); XSS | `AST::parseMarkup`, `addToDOM`, `filterUserAttributes` | exporting allowlist |
| Format string output | `Templating::format` | `ts/masters-es5/polyfills.ts` |
| Number format | `Templating::numberFormat` | `lang`, `chart.numberFormatter` |
| Date text, locale, timezone | `TimeBase::dateFormat`, `dateTimeFormat`, `update` | `Globals.pageLang` |
| DST, tick placement | `TimeBase::makeTime`, `Time::getTimeTicks` | `DateTimeAxis`, ordinal |
| Color parse, brighten, tween | `Color` | boost `WGLRenderer` |
| Gradients, patterns | `SVGElement::complexColor`, `PatternFill` | `Fx::fillSetter` |
| Path morph glitches | `Fx::initPath` | Line/Area `startX`/`endX` |
| Palette, CSS vars, dark mode | `Palette` | `css/highcharts.css`, exporting `resolveCSSVariables` |

Tests: `samples/unit-tests/{svgrenderer,ast,time,color,utilities}/`; Playwright `tests/highcharts/{svgrenderer,time,palette}`.

## Must change together

- New text CSS property (see `lineClamp`): `CSSObject.ts`, the strip list in `SVGElement.css`, `SVGLabel.textProps`, `TextBuilder` and its cache, the `getBBox` cache key, `HTMLElement.css`.
- New emitted tag or attribute: AST allowlists and the exporting allowlist.
- New class names: styles in `css/highcharts.css`; palette vars also in `css/highcharts-palette.css`.

## Core vs module

Core holds what a default chart uses; other features attach through the extension points above (TextPath via `afterModifyTree`, PatternFill via `complexColor`, extra symbols via the registry). From a module, use `renderer.symbols`, `renderer.label()`, `chart.time` or `import type`: value-importing `Symbols`, `SVGLabel`, `TextBuilder`, `TimeBase` or `BorderRadius` duplicates them into the module bundle.

## Gotchas

- `attr()` stops the animation of each key it sets and sends keys without a setter to `setAttribute`, so internal properties leak into the DOM.
- The bbox cache key ignores font family and letter spacing, and treats all digits as `0`. Text is not built until `add()`.
- Styled mode: factories skip presentational attributes, but explicit `attr()`/`css()` calls always write. Guard them with `styledMode`.
- Default colors are `var(--highcharts-…)`: `Color.parse()` gives NaN rgba, and `brighten`/`setOpacity`/`tweenTo` return `color-mix()`. Resolve vars before numeric color math.
- Defs references must be `url(${renderer.url}#id)`.
- `renderer.symbols` is one object shared by all charts. An unknown symbol draws a circle.
- `format`/`numberFormat`/`dateFormat` without an owner use global defaults. Pass the chart.
- `useHTML` visibility, opacity and transform belong on the `foreignObject`. Exported SVG keeps HTML only with `exporting.allowHTML`.
