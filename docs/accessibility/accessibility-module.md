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

We always recommend providing a text description of your chart. This is usually best placed in visible text around the chart, so that all users can benefit from knowing what the chart should convey. If making the text visible is not desirable, you can set the [`accessibility.description`](https://api.highcharts.com/highcharts/accessibility.description) option. Setting this option will expose the description to screen reader users, but keep it visually hidden. This allows screen reader users to quickly get the main takeaway from the chart, and also find out if they should invest more time in it. The description should concisely explain what can be learned from the chart.

```js
Highcharts.chart(‘container’, {
    // …
    
    accessibility: {
        description: 'Shows how apples have been more popular than oranges for the past 10 years \
        Oranges are gaining in popularity over the past 3 years, but are still far from as popular as apples.'
    }

    // ....
});
```

See [demos using the Accessibility module](https://www.highcharts.com/demo#accessible-charts).

[Read more about our accessibility work](https://www.elsevier.com/connect/making-charts-accessible-for-people-with-visual-impairments).
