Accessibility module
===

The accessibility of Highcharts is critical to us. Every Highcharts license includes our Accessibility module, which helps ensure your charts are as accessible as possible. We use the WCAG 2.1 standard as our guideline for this, as well as involving users with disabilities in our testing and feature development.

We recommend to always include the accessibility module, unless there is an explicit reason not to do so. Including this module will make your charts compatible with assistive technologies used by people with disabilities, and also improve the usability of your charts, helping you reach a broader audience. Including the Accessibility module will also help with SEO by making your charts more visible to web crawlers.

To include the accessibility module, simply include the following file after including any of the Highcharts JS files:

```html
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
```

We also recommend including the exporting and export-data modules. This lets users download the chart for use with e.g. tactile printers, as well as viewing the chart as a data table. These modules should be loaded before the Accessibility module.

```html
<script src="https://code.highcharts.com/modules/exporting.js"></script>  
<script src="https://code.highcharts.com/modules/export-data.js"></script>  
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
```

Describing your chart
---------------------

The accessibility module is highly configurable, but the most important option we will always recommend you provide is a text description of your chart. This is essential for SEO, accessibility for users with disabilities, and to help ensure your readers understand what the chart is about. The description should concisely explain what can be learned from the chart. For screen reader users, this enables fast access to the main takeaway of the chart, and also helps them decide if they should invest more time in exploring the chart further. The text description is usually best placed in visible text around the chart, so that all users can benefit from knowing what the chart should convey.

If you place the description next to the chart with the `highcharts-description` class set on the description element, Highcharts will automatically link this description to the chart and make it available to screen reader users.

```js
<figure>
    <div id="chart-container"></div>
    <p class="highcharts-description">Chart showing how 2020 has seen a massive growth in sales compared to 2019 and 2018.</p>
</figure>
```

This behavior can be configured with the [`accessibility.linkedDescription`](https://api.highcharts.com/highcharts/accessibility.linkedDescription) option. It is possible to link the chart to any element on the page using this option. The use of the `<figure>` element in the example above is optional, but can help convey to screen reader users that they are navigating a diagram. Note that use of the `<figcaption>` element should be avoided in this context, as it will interfere with the accessibility features of Highcharts.

It is possible to add the text description directly on the chart SVG as well, using the [`caption`](https://api.highcharts.com/highcharts/caption) option. If this option is used, the caption will automatically be made available to screen reader users.

If making the text visible is not desirable, or you prefer to add a separate description for screen reader users, you can set the [`accessibility.description`](https://api.highcharts.com/highcharts/accessibility.description) option. Setting this option will expose the description to screen reader users, but keep it visually hidden. This is not generally recommended, since making the description visible will also improve cognitive accessibility, and make it easier for all users to understand the message of the chart. Hidden descriptions are also prone to be forgotten if the chart is updated in the future.


See [demos using the Accessibility module](https://www.highcharts.com/demo#accessible-charts).

Read more about [configuring the Accessibility module](https://www.highcharts.com/docs/accessibility/configure-the-accessibility-module).

[Read more about our accessibility work](https://www.elsevier.com/connect/making-charts-accessible-for-people-with-visual-impairments).
