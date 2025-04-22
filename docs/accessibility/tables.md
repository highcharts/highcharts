Tables
===

Including the [export-data](https://code.highcharts.com/modules/export-data.js) module will enable viewing the chart as a data table. This module also requires the [exporting](https://code.highcharts.com/modules/exporting.js) module.

```html
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>
```

There are three different ways to access the data table:
1. Clicking the export menu and then "Show data table".
2. A hidden button for screen reader users to access the table before the chart.
3. You can set the option [`exporting.showTable`](https://api.highcharts.com/highcharts/exporting.showTable). The table will then show up when the page is rendered.

```js
Highcharts.chart('container', {
    exporting: {
        showTable: true,
    }
    // ...
});
```

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/accessibility/accessible-table" allow="fullscreen"></iframe>

[View demo code](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/accessibility/accessible-table)

Note that simply showing the chart data as a table is not considered a sufficient accessible alternative to a chart, and you should still enable the Accessibility module unless there is a specific reason not to do so.

See our [data-module documentation article](https://www.highcharts.com/docs/working-with-data/data-module) for more information on the data module and working with tables in Highcharts.
