# Accessibility

Bundle `modules/accessibility`: all of `ts/Accessibility/**`. Master: `Accessibility.compose(G.Chart, G.Legend, G.Point, G.Series, G.SVGElement, G.RangeSelector)`.

## Files

- `Accessibility.ts`: `init`, `initComponents` (series first), `update`, `destroy`; chart hooks; merges `A11yDefaults`, `LangDefaults` and the high contrast theme into `defaultOptions` at load.
- `AccessibilityComponent.ts`: component base; `initBase` creates event, DOM and proxy providers, cleaned up in `destroyBase`. Subclasses implement `init`, `onChartUpdate`, `onChartRender`, `getKeyboardNavigation`, `destroy`.
- `KeyboardNavigation.ts` (module order from `accessibility.keyboardNavigation.order`, focus, exit anchor) and `KeyboardNavigationHandler.ts` (key map; `run()` returns success, prev, next, noHandler or fail).
- `ProxyProvider.ts` and `ProxyElement.ts`: transparent HTML buttons and inputs over SVG elements, in groups before and after the SVG.
- `FocusBorder.ts` (`chart.setFocusToElement`), `A11yI18n.ts` (`chart.langFormat`), `HighContrastMode.ts`, `HighContrastTheme.ts`.
- `Components/`: `ContainerComponent`, `InfoRegionsComponent` (screen reader sections before and after, data table and sonify buttons), `LegendComponent`, `MenuComponent` (export menu), `RangeSelectorComponent`, `NavigatorComponent` (range inputs over handles), `ZoomComponent` (reset zoom, drill up, map zoom), `SeriesComponent/` (`SeriesDescriber`, `SeriesKeyboardNavigation`, `ForcedMarkers`, `NewDataAnnouncer`).
- `Options/`: `A11yDefaults.ts` + `A11yOptions.d.ts`, `LangDefaults.ts` + `LangOptions.d.ts`, `DeprecatedOptions.ts`.
- `Utils/`: `Announcer`, `ChartUtilities`, `HTMLUtilities`, `EventProvider`, `DOMElementProvider`.

## Flows

- Creation: chart `render` (after `load`) → `updateA11yEnabled` → `new Accessibility` → components `init` → `KeyboardNavigation`. Then `update()`: each component's `onChartUpdate`, keyboard navigation rebuilt, proxies positioned, each `onChartRender`.
- Every render: proxies repositioned, every `onChartRender` runs (descriptions, sections, menu and zoom proxies).
- `chart.update` with changed `accessibility` options destroys and rebuilds it on the next render.
- Keyboard: Tab into container → first valid module `init(1)`; keydown → `module.run(e)`; next/prev → `move(±1)`, or leave through the exit anchor.
- Series: arrows → `highlightAdjacentPoint`/`Series` → `point.highlight()` (`onMouseOver`, scroll, focus). Enter/Space → point `click` (drives drilldown).
- Announcements: series `addPoint`/`updatedData` → on redraw `NewDataAnnouncer` → `Announcer`.

## Extension points

- Custom components: `accessibility.customComponents` plus a name in `keyboardNavigation.order`. Built-in: add to `initComponents`, the components object and the default `order` in `A11yDefaults`.
- Series types: prototype flag `keyboardMoveVertical`; lang keys `chartTypes.<type>Single|Multiple`, `series.summary.<type>`, `seriesTypeDescriptions.<type>`.
- a11y listens to events from other modules: exporting (`exportMenuShown`, `getSVG`), export-data (`afterViewData`), drilldown, range selector (`afterBtnClick`), navigator, series label, boost.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Point label text | `SeriesDescriber::getPointValueDescription`, `defaultPointDescriptionFormatter` | `HTMLUtilities::stripHTMLTagsFromString` |
| Null points missing or stale | `SeriesDescriber::describePointsInSeries`, `addMockPointElement` | core `Point::update` `hasMockGraphic` |
| Series label or role | `SeriesDescriber::defaultSeriesDescriptionFormatter` | `SeriesComponent::onChartRender` |
| Ghost markers after zoom or update | `ForcedMarkers` | styled-mode CSS |
| Arrow keys skip or stick | `SeriesKeyboardNavigation::isSkipPoint`, `chartHighlightAdjacentPoint` | `keyboardMoveVertical` |
| Tab order, keyboard trap | `KeyboardNavigation::move`, `onFocus`, exit anchor | the component's `validate` |
| Legend proxies | `LegendComponent::proxyLegendItem`; `ProxyElement::getTargetPosition` | |
| Export menu | `MenuComponent` | `Exporting.ts` fields and events |
| Zoom and drill-up buttons | `ZoomComponent` | `Breadcrumbs` |
| Range selector, navigator | `RangeSelectorComponent`, `NavigatorComponent` | |
| Focus ring | `FocusBorder` | `KeyboardNavigation::onMouseUp` |
| Screen reader sections, data table | `InfoRegionsComponent` | lang `chartTypes`, `ExportData.ts` events |
| Announcements | `NewDataAnnouncer`, `Utils/Announcer` | |
| Wrong strings | `LangDefaults.ts` + `LangOptions.d.ts` + `i18n/highcharts/*.json` | `npx gulp lang-build` |

## Core vs module

Core has only the fallback for a missing module (`role=img`, label, warning in `Chart.warnIfA11yModuleNotLoaded`), the AST allowlist for `aria-*`, `role`, `tabindex`, and small hooks. Put a11y behavior in `ts/Accessibility/`. If a hook is missing, add a `fireEvent` in the owning file; never import a11y code into core or other modules.

## Gotchas

- `chart.accessibility` does not exist yet in `load` handlers.
- The a11y bundle has its own copy of `Navigator`; only externalized classes (Legend, Point, Series, Axis, SVGRenderer…) are shared with stock.
- Proxy group keys must equal component names in `order`; an unknown name in `order` throws.
- New elements are hidden from assistive tech unless unhidden (`unhideChartElementFromAT`).
- QUnit tests always load the a11y module (`test/karma-files.json`), so forced markers and proxies affect unrelated tests.
- `langFormat` returns `''` for a missing key.
