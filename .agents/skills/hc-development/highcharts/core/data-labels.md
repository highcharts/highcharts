# Data labels

Core, overridden in many series types: check the whole chain before changing shared code.

## Files

- `Core/Series/DataLabel.ts`: `DataLabel.compose(Series)` adds `drawDataLabels`, `alignDataLabel`, `justifyDataLabel`, `initDataLabels`, `initDataLabelsGroup`, `mergeArrays`, `hasDataLabels`.
- `Core/Series/OverlappingDataLabels.ts`: `chart.hideOverlappingLabels` over `chart.labelCollectors`.
- `Series/Column/ColumnDataLabel.ts`: column `alignDataLabel` (inside, below, inverted, clamped to the plot).
- `Series/Pie/PieDataLabel.ts`: pie `drawDataLabels`, `getDataLabelPosition`, `placeDataLabels`, `verifyDataLabelOverflow`, connectors (`PiePoint.connectorShapes`). Uses `RendererUtilities.distribute`.
- `Series/RangeDataLabel.ts` (more): arearange, columnrange, dumbbell, boxplot, errorbar.
- Own `drawDataLabels`: AreaRange, ErrorBar, Funnel, Item, Lollipop, Map, MapPoint, Networkgraph, Organization, PackedBubble, Sankey, ArcDiagram, Treegraph, Treemap, PivotPoints.
- Own `alignDataLabel`: Bubble, Funnel, Funnel3D, Heatmap, Tilemap, Sunburst, Timeline, Treegraph, Treemap, XRange, Organization, PackedBubble, Lollipop. Polar and 3D wrap it.

## Flow

`Series.render` → `drawDataLabels` (fires `drawDataLabels`; runs only if `hasDataLabels()`):

1. Options per point: `mergeArrays` of `plotOptions.series`, `plotOptions[type]`, series and point `dataLabels` (arrays allowed).
2. Enabled only if the point is visible, not null and passes `filter`. Text from `format` or `formatter`.
3. Reuse the label or create it with `renderer.label`; fires `beforeAddingDataLabel`.
4. `initDataLabelsGroup` (one group per config index).
5. `alignDataLabel` → `align` to the box; `justifyDataLabel` when `overflow: 'justify'`, else crop check.
6. Destroy inactive labels; fire `afterDrawDataLabels`.

Pie: base flow, then per half `distribute()`, `verifyDataLabelOverflow` (may shrink the pie and re-run `translate`), `placeDataLabels`, connectors. Slices draw after labels (`redrawPoints`).

Overlap: on chart `render`, collect labels (series, stack labels, plot line labels) → `hideOverlappingLabels` by `labelrank` → hide or show. Fires `afterHideOverlappingLabel`, `afterHideAllOverlappingLabels`.

## Where to fix

| Symptom | Fix in | Also check |
|---|---|---|
| Labels not shown or not updated | `DataLabel::drawDataLabels`, `mergeArrays`, `hasDataLabels` | dataLabels merge in `Series::update` |
| Slow with many labels; group or zIndex | `DataLabel::initDataLabelsGroup`, `initDataLabels` | |
| Generic align or justify | `DataLabel::alignDataLabel`, `justifyDataLabel` | `SVGElement::align`, `SVGLabel` |
| Column, bar, waterfall placement | `ColumnDataLabel::alignDataLabel` | `RangeDataLabel`, Column3D |
| Pie labels crossing, connectors, shrinking | `PieDataLabel::drawDataLabels`, `verifyDataLabelOverflow`, `placeDataLabels` | `distribute`, `PiePoint.connectorShapes` |
| Labels wrongly hidden | `OverlappingDataLabels::hideOverlappingLabels` | `SVGElement::getBBox`, `getRotatedBox` |
| Label box, padding, contrast | `SVGLabel`, `SVGElement::applyTextOutline` | [renderer.md](renderer.md) |
| One series type only | that type's override (list above) | |

Tests: `samples/unit-tests/datalabels/`, `series-pie/`, `series-column/`.

## Gotchas

- Label entrance positions come from `point.origin`.
- Labels of `condemnedPoints` are still drawn during removal animation.
- A point config with `dataLabels` gives the series an own `hasDataLabels()` returning true, kept through `update`.
- In styled mode, `width`, `textOverflow` and `whiteSpace` still apply.
