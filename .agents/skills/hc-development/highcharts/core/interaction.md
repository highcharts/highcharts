# Pointer, tooltip, legend

All in core.

## Files

- `Core/Pointer.ts`: mouse and touch. `normalize`, `getChartPosition`, `runPointActions`, `getHoverData`, `findNearestKDPoint`, `reset`, click, `drag`/`drop` (selection), `touch`/`pinch`, `zoomOption`.
- `Core/Tooltip.ts`: `refresh`, `hide`, `getLabel`, `getAnchor`, `getPosition`, `getFixedPosition`, `updatePosition`, `move`, `renderSplit`, `headerFooterFormatter`, `bodyFormatter`, stickOnContact tracker. Defaults in `Core/Defaults.ts`, types in `TooltipOptions.ts`.
- `Core/Legend/Legend.ts`: `render`, `renderItem`, `layoutItem`, `handleOverflow` (paging), `scroll`, `align`, `colorizeItem`, `setItemEvents`, checkboxes. `LegendSymbol.ts`: `lineMarker`, `areaMarker`.
- Series and point side: `Series.searchPoint`, `buildKDTree`, `searchKDTree`, `onMouseOver`, `onMouseOut`, `setState`, `drawTracker`, `drawLegendSymbol`, `setVisible`; `Point.onMouseOver`, `onMouseOut`, `setState`, `tooltipFormatter`, `firePointEvent`. `ColumnSeries.drawTracker` handles `directTouch` hover for column, pie and map.

## Flows

- Hover: container `mousemove` → `Pointer.onContainerMouseMove` → `runPointActions` → `getHoverData` (fires `beforeGetHoverData`; nearest point via `findNearestKDPoint` → `series.searchPoint` → KD tree, 1D unless `findNearestPointBy` includes `y`; shared mode adds same-x points; fires `afterGetHoverData`) → state changes (`setState('hover')`, `applyInactiveState`) → `point.firePointEvent('mouseOver')`, default action `tooltip.refresh` → crosshairs (`axis.drawCrosshair`).
- Leave: tracker `mouseout` → `series.onMouseOut`; container `mouseleave` → `reset` → `tooltip.hide`, crosshairs hidden.
- `Tooltip.refresh(points, e)`: `getAnchor` (mouse, `point.tooltipPos` or average of `point.pos()`; fires `getAnchor`) → text from `format`, `formatter` or `defaultFormatter` (`headerFooterFormatter` fires `headerFormatter`; body uses `point.tooltipFormatter(pointFormat)`) → split: `renderSplit` (one label per series, placed with `distribute`); else `getLabel` → `updatePosition` (`positioner`, `fixed` or `getPosition`) → `move`. Fires `refresh`.
- Zoom and pan all end in `Chart.transform`: `axis.setExtremes(…, false)` per axis, then `showResetZoom` and one redraw. There is no `Chart.zoom`.
  - Selection: `onContainerMouseDown` → `zoomOption` (from `chart.zooming`) → `dragStart` → `drag` (selection marker) → document mouseup → `drop` → `transform` (fires `selection`, default re-runs `transform`).
  - Pan: `drag` with `panKey` → `chart.pan` (fires `pan`, default `transform`).
  - Touch: `touch` → `pinch` → fires `touchpan` → `transform`.
  - Reset: button → `zoomOut` → `transform({ reset: true })`.
  - Wheel: `modules/mouse-wheel-zoom` → `transform`.
- Legend `render`: `getAllItems` (fires `afterGetAllItems`) → title → sort → `renderItem` per item (text, `series.drawLegendSymbol`, events, `colorizeItem`) → `layoutItem` → `handleOverflow` (pages) → `align` → `positionItems` → fires `afterRender`. Item click fires `itemClick` (default `item.setVisible()`), then `legendItemClick`.

## Extension points

- Pointer: `afterInit` (creates the tooltip), `beforeGetHoverData` and `afterGetHoverData` (pane, boost), `getSelectionBox` and `getSelectionMarkerAttrs` (polar). Maps wrap `normalize` and `zoomOption` (`Maps/MapPointer.ts`); polar wraps `getCoordinates` and `pinch`.
- Tooltip: `headerFormatter` (data grouping), `getAnchor` (non-cartesian zoom), `refresh`.
- Legend: `afterGetAllItems` (color axis, bubble legend), `afterColorizeItem`, `afterRender`, `afterPositionItem`, `afterScroll` (a11y), `itemClick` (bubble legend). Series types override `drawLegendSymbol` (OHLC, color axis).
- Take over zoom or pan: `preventDefault` on chart `selection`, `pan` or `touchpan` (MapView and OrdinalAxis do).

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Wrong or missing hovered point; shared points | `Pointer::getHoverData`, `findNearestKDPoint` | `Series::searchPoint`, `buildKDTree`; `stickyTracking` in `Series::setOptions` |
| Hover or inactive states wrong | `Pointer::applyInactiveState`, `runPointActions` | `Series::setState`, `Point::onMouseOut` |
| Tooltip position (outside, CSS scale, padding) | `Tooltip::getPosition`, `updatePosition` | `Pointer::getChartPosition`, `getPlayingField` |
| Tooltip anchor or animation jitter | `Tooltip::move`, `getAnchor` | `point.tooltipPos` in the series type |
| Split tooltip layout | `Tooltip::renderSplit` | `RendererUtilities::distribute` |
| Tooltip text, header or date | `Tooltip::headerFooterFormatter`, `bodyFormatter` | `Point::tooltipFormatter`, `DateTimeAxis` `getXDateFormat`, data grouping hook |
| stickOnContact | `Tooltip::shouldStickOnContact`, `drawTracker` | `Pointer::onContainerMouseMove` |
| Selection zoom extremes | `Chart::transform` | `Pointer::drop`, `getSelectionBox` |
| Panning broken for an axis or series type | `Chart::transform`, `pan` | `Pointer::drag`; `OrdinalAxis` pan handler |
| Reset zoom button | `Chart::showResetZoom` | navigator, drilldown, breadcrumbs |
| zoomKey, panKey, zooming type ignored | `Pointer::zoomOption`, `drag` | `Chart::setZoomOptions` |
| Touch scroll blocked, pinch, followTouchMove | `Pointer::touch`, `pinch`, `setPointerCapture` | `onDocumentMouseUp` |
| Click after drag; mouseup across charts | `Pointer::drop`, `onContainerClick` | `setHoverChartIndex` |
| Legend paging cuts items | `Legend::handleOverflow`, `scroll` | `positionCheckboxes` |
| Legend item width, wrap, symbol | `Legend::renderItem`, `layoutItem` | `Series::drawLegendSymbol`, `LegendSymbol` |
| Legend broken after update | `Legend::update`, `destroyItem` | color axis legend hooks |

## Related code

- Maps: `Maps/MapPointer.ts`, `MapNavigation.ts`, `MapView.ts` (pan, zoom, wheel, buttons). Stock: navigator and range selector call `setExtremes`.
- Polar and panes: `Series/PolarComposition.ts`, `Extensions/Pane/PaneComposition.ts`.
- a11y: `Accessibility/Components/{LegendComponent,ZoomComponent}.ts`; keyboard navigation calls `point.onMouseOver()`.
- Tests: `samples/unit-tests/{pointer,tooltip,legend,interaction}/`, `samples/unit-tests/chart/{zoomtype,panning,mouse-wheel}`.

## Gotchas

- Tooltip options have two sources: format options, `followPointer` and `distance` from `series.tooltipOptions` (merged in `Series.setOptions`); mode options (`shared`, `split`, `outside`, `fixed`, `positioner`) from `chart.tooltip.options`.
- `split` is silently off for inverted and polar charts. `shared` is on when `split` is. `stickyTracking` defaults to true when shared.
- Pointer state is partly global: `Pointer.hoverChartIndex`, one mouseup listener per document and one touchend listener, shared by all charts.
- `pointer.chartPosition` is a cache; delete it when the container moves, or hover and tooltips are offset.
- Pan, pinch and wheel set `axis.isPanning`, which suppresses start/endOnTick until `Pointer.drop`.
- `preventDefault` on `mouseOver`, `itemClick` or `selection` silently disables the tooltip, legend toggle or zoom.
