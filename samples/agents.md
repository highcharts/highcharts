# Guidelines for Highcharts samples

When authoring new demos, always include the Accessibility module unless there is a specific reason not to. This ensures the charts remain usable for all visitors.

## Accessibility Requirements for Agents

When creating Highcharts demos, ensure the following requirements are met:

1. **Critical** – Load the Accessibility module after all other Highcharts modules. You can either import the module directly, or add the `Accessibility` wrapper component from `@highcharts/react/options/Accessibility`, which activates the module automatically when making a React demo.
2. Configure chart accessibility options:
   - Provide a unique chart container label.
   - **Critical** – Set an accurate type description for the chart.
   - Add a linked description explaining the chart’s purpose and content.
   - **Critical** – Supply descriptive axis titles.
   - **Critical** – Define axis range descriptions.
3. Configure data-point accessibility:
   - **Critical** – Ensure point `aria-label`s include key information with proper formatting.
   - **Critical** – Set the parent series `aria-label` appropriately.
4. Enable tooltip stickiness so the tooltip does not vanish on hover.
5. For large datasets, adjust the point description threshold and consider enabling sonification.
6. For charts with drilldown or live updates, configure dynamic data announcing.
7. Ensure series colors meet at least a 3:1 contrast ratio against the background.
8. If export-data is used, verify the exported table output.
9. Ensure charts are responsive down to 320 px width.
10. Enable Windows High Contrast Mode support when possible.

Consult the [Highcharts Accessibility Docs](https://www.highcharts.com/docs/accessibility/accessibility-module) for detailed guidance.
