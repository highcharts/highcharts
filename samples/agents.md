# Guidelines for Highcharts samples

When authoring new demos, always include the Accessibility module unless there is a specific reason not to. This ensures the charts remain usable for all visitors.

## Accessibility Requirements for Agents

When creating Highcharts demos, ensure the following requirements are met:

1. **Critical** – Load the Accessibility module after all other Highcharts modules. You can either `import Accessibility from 'highcharts/modules/accessibility'` (and call `Accessibility(Highcharts)`), or add the `Accessibility` wrapper component from `@highcharts/react/options/Accessibility`, which activates the module automatically in React demos.
2. Configure chart accessibility options via Highcharts settings:
   - Provide a unique container label with `lang.accessibility.chartContainerLabel` or by enabling `accessibility.landmarkVerbosity: 'all'`.
   - **Critical** – Set `accessibility.typeDescription` with an accurate chart type explanation.
   - Attach supporting copy using `accessibility.linkedDescription`.
   - Surface longer narrative text with `accessibility.screenReaderSection.beforeChartFormat` and `accessibility.screenReaderSection.afterChartFormat`.
   - **Critical** – Supply descriptive axis titles through `xAxis.title.text` / `yAxis.title.text` (and for multi-axis charts, each axis’ `title.text`).
   - **Critical** – Define axis range descriptions with `xAxis.accessibility.rangeDescription` / `yAxis.accessibility.rangeDescription`.
3. Configure data-point accessibility with:
   - **Critical** – Custom `aria-label` content via `accessibility.point.descriptionFormatter` or `accessibility.point.valueDescriptionFormat`.
   - **Critical** – A series-level description using `series.accessibility.description`.
   - For dense datasets, use `series.accessibility.exposeAsGroupOnly: true` so navigation lands on the series instead of every point.
4. Keep the tooltip available for assistive tech by setting `tooltip.stickOnContact: true`.
5. For large datasets, tune `accessibility.series.pointDescriptionEnabledThreshold` and enable alternative output with `sonification.enabled`.
6. For drilldown or live updates, announce changes through `accessibility.announceNewData.enabled` and `accessibility.announceNewData.announcementFormatter`.
7. Keep keyboard interactions consistent with `accessibility.keyboardNavigation.enabled` and tweak per-series behavior via `accessibility.keyboardNavigation.seriesNavigation`.
8. Ensure color contrast by adjusting `colors`, per-series `color`, or `colorAxis.stops` to meet accessibility targets.
9. When exposing data tables, configure `exportData.tableCaption`, `exportData.columnHeaderFormatter`, and optionally `exporting.showTable`.
10. Maintain small-screen support with `responsive.rules` and `chart.reflow: true` for 320 px layouts.
11. Enable Windows High Contrast Mode adaptations via `accessibility.highContrastMode` and tailor them with `accessibility.highContrastTheme`.

Consult the [Highcharts Accessibility Docs](https://www.highcharts.com/docs/accessibility/accessibility-module) for detailed guidance.
