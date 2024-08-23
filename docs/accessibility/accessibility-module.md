Accessibility module
===

The accessibility of Highcharts is critical to us. Accessibility should be fundamental to any software project, not an afterthought. Every Highcharts license includes our Accessibility module, which helps ensure your charts are as accessible as possible. We use the WCAG 2.1 standard as our guideline for this, as well as involving users with disabilities in our testing and feature development.

We recommend to always include the accessibility module, unless there is an explicit reason not to do so. Including this module will make your charts compatible with assistive technologies used by people with disabilities, and also improve the usability of your charts, helping you reach a broader audience. Including the Accessibility module will also help with SEO by making your charts more visible to web crawlers.

Visit our [accessibility portal](https://www.highcharts.com/accessibility/) to learn more about Highcharts' accessibility features.

Getting started with accessibility
----------------------------------
*Read more about [installation of Highcharts](https://www.highcharts.com/docs/getting-started/installation) and [setting up your first chart](https://www.highcharts.com/docs/getting-started/your-first-chart).*

To include the accessibility module, simply include the following file after including any of the Highcharts JS files:

```html
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
```
If the module is not included, there will be a warning in the browser console.

We also recommend including the exporting and export-data modules. This lets users download the chart for use with e.g. tactile printers, as well as viewing the chart as a data table. These modules should be loaded before the Accessibility module.

```html
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
```

Example of a line chart with the Accessibility module:
<iframe style="width: 100%; height: 470px; border: none;" src='https://www.highcharts.com/samples/embed/highcharts/accessibility/accessible-line' allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-line)

### What happens if I do not include the module?
While the demo will be visually identical, it will provide a different experience for users that rely upon assistive technology. A chart with the Accessibility module enabled has additional features that make it more accessible. These features include text description of the chart, keyboard navigation, and support for ARIA roles and attributes on chart elements. This means that assistive technology can interpret the chart, which provides the user with a detailed understanding of its content. You are also able to navigate the chart with a keyboard. A chart without the accessibility module lacks these features and is interpreted as an image with the chart title as the `aria-label` for the SVG.

Basic configuration
-------------------
Understanding the fundamentals of the Accessibility module in Highcharts is crucial for creating accessible data visualizations. The module does provide simple ways to make your chart accessible.

### Enhancing Chart Accessibility
One simple, yet effective way to enhance the accessibility of your charts is by providing a chart title and titles for the axes in your chart. Highcharts will by default make the text available to a screen reader when these options are set. This provides users with valuable context of understanding the chart data. Not only for screen readers, but also visually.

The example shows a simple configuration with title, subtitle and some data:
```js
    chart: {
            type: 'column'
        },
        title: {
            text: 'Corn vs wheat estimated production for 2020',
            align: 'left'
        },
        subtitle: {
            text:
                'Source: indexmundi',
            align: 'left'
        },
        series: [
            {
                data: [406292, 260000, 107000, 68300, 27500, 14500]
            },
            {
                data: [51086, 136000, 5500, 141000, 107180, 77000]
            }
        ]
```

The configuration above gives us this chart:
<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/accessibility/not-accessible-simple-config allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/not-accessible-simple-config)

We can improve this chart with just a few options. If you add `series.name`, `yAxis.title.text`, `xAxis.title.text`, `xAxis.categories` and `tooltip.valueSuffix`.

After adding the options, the configuration now looks like this:
```js
    chart: {
            type: 'column'
        },
        title: {
            text: 'Corn vs wheat estimated production for 2020',
        },
        subtitle: {
            text:
                'Source: <a target="_blank" ' +
                'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>',
        },
        xAxis: {
            categories: ['USA', 'China', 'Brazil', 'EU', 'India', 'Russia'],
            title: {
                text: 'Countries',
            }
        },
        yAxis: {
            title: {
                text: '1000 metric tons (MT)'
            }
        },
        tooltip: {
            valueSuffix: ' (1000 MT)',
        },
        series: [
            {
                name: 'Corn',
                data: [406292, 260000, 107000, 68300, 27500, 14500]
            },
            {
                name: 'Wheat',
                data: [51086, 136000, 5500, 141000, 107180, 77000]
            }
        ]
```

The following example demonstrates a simple configuration with chart title, series name, titles for both the axis and value suffix for the tooltip:
<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/accessibility/accessible-simple-config allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-simple-config)

By adding these options, you have already improved the charts readability both visually and for assistive technology. It is important to note that above configuration does not require any customization of the Accessibility options. This demonstrates the power of Highcharts' default accessibility support by just including the module. By simply providing meaningful titles and names, you can create a chart that is accessible to a wide range of users. For more complex charts or specific accessibility needs, you can further customize the options within the Accessibility module.

### Linked description:
The Accessibility module is highly configurable, but the most important option we will always recommend you provide is a text description of your chart. This is essential for SEO, accessibility for users with disabilities, and to help ensure your readers understand what the chart is about. The description should concisely explain what can be learned from the chart. For screen reader users, this enables fast access to the main takeaway of the chart, and also helps them decide if they should invest more time in exploring the chart further. The text description is usually best placed in visible text around the chart, so that all users can benefit from knowing what the chart should convey.

If you place the description next to the chart with the `highcharts-description` class set on the description element, Highcharts will automatically link this description to the chart and make it available to screen reader users.

This behavior can be configured with the [`accessibility.linkedDescription`](https://api.highcharts.com/highcharts/accessibility.linkedDescription) option. It is possible to link the chart to any element on the page using this option. The use of the `<figure>` element in the example above is optional, but can help convey to screen reader users that they are navigating a diagram. Note that use of the `<figcaption>` element should be avoided in this context, as it will interfere with the accessibility features of Highcharts.

```js
<figure>
    <div id="chart-container"></div>
    <p class="highcharts-description">The following chart demonstrates some accessibility features  of Highcharts, including use of the <code>linkedDescription</code> option.</p>
</figure>
```
<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/accessibility/accessible-avg-temp allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/tree/master/samples/highcharts/accessibility/accessible-avg-tmp)

### Caption:

It is possible to add the text description directly on the chart SVG as well, using the [`caption`](https://api.highcharts.com/highcharts/caption) option. If this option is used, the caption will automatically be made available to screen reader users. The caption renders at the bottom of the chart, and is included if the chart is exported.

```js
Highcharts.chart('container', {
    caption: {
        text: '<b>The caption renders in the bottom, and is part of the exported chart.</b>'
    },
    // ...
});

```
<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/caption/text allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/caption/text)

### Description:

If making the text visible is not desirable, or you prefer to add a separate description for screen reader users, you can set the [`accessibility.description`](https://api.highcharts.com/highcharts/accessibility.description) option. Setting this option will expose the description to screen reader users, but keep it visually hidden. This is not generally recommended, since making the description visible will also improve cognitive accessibility, and make it easier for all users to understand the message of the chart. Hidden descriptions are also prone to be forgotten if the chart is updated in the future.

Example with [`accessibility.description`](https://api.highcharts.com/highcharts/accessibility.description):

```js
Highcharts.chart('container', {
    accessibility: {
        description: 'This is the most used desktop screen reader'
    },
    // ...
});

```

<iframe style="width: 100%; height: 470px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/accessibility/accessible-bar allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-bar)

Other accessible features
-------------------------
The Accessibility module adds several layers of functionality for making your charts compatible with assistive technologies, improving the usability of your charts, and helping you reach a broader audience.

- Keyboard navigation
- Screen readers
- Low vision features
- Voice input
- Tactile export
- Sonification / Audio charts
- Cognitive accessibility
- Internationalization


See [demos using the Accessibility module](https://www.highcharts.com/demo#accessible-charts).

Read more about [advanced configuring of the Accessibility module](https://www.highcharts.com/docs/accessibility/configure-the-accessibility-module).

[Read more about our accessibility work](https://www.elsevier.com/connect/making-charts-accessible-for-people-with-visual-impairments).