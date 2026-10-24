---
name: highcharts-accessibility
description: "Highcharts accessibility and sonification: assistive technology support, keyboard navigation, chart descriptions, audio charts, and React module usage from the bundled docs."
---

# Highcharts Accessibility

Use this for application work with Highcharts accessibility or sonification, including accessibility configuration, keyboard and screen-reader support, audio playback and mapping, and @highcharts/react module imports.

## Workflow

1. Start with `references/docs/index.md` and select the accessibility, sonification, and React entries relevant to the task.
2. Read the selected docs before coding; cover every accessibility or audio behavior and configuration used, or identify an API reference for exact signatures.
3. For React, use the `Accessibility` module component and pass documented accessibility options as props. Import only the components and modules used by the chart.
4. Make audio playback discoverable through an explicit user control or documented chart control, and consider navigation, speech, and notification needs.
5. Test the resulting chart with relevant assistive technology and the intended interaction flow; treat standards compliance as an application-level verification task.

## Boundaries

- This skill covers the Accessibility module, sonification, and the included React accessibility, setup, and bundling guidance; consult other documentation for unrelated chart or React features.
- Sonification supports general data exploration, engagement, and notifications as well as accessibility use cases.
- The Accessibility module improves chart accessibility but does not guarantee compliance for the final application; verify custom content, configuration, colors, plugins, and interactions.
- Use the included API links for exact accessibility, sonification, and React module signatures.

## References

- Live accessibility docs: https://www.highcharts.com/docs/accessibility/
- Accessibility API: https://api.highcharts.com/highcharts/accessibility
- Sonification getting started: https://www.highcharts.com/docs/sonification/getting-started
- Sonification API: https://api.highcharts.com/highcharts/sonification
- React accessibility module: https://www.highcharts.com/docs/react/components/modules/accessibility
- React bundling: https://www.highcharts.com/docs/react/bundling-and-tree-shaking
