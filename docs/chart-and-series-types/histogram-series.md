Histogram
===

A histogram series is a graphical representation of the data distribution of an attribute. Histogram creates intervals (bins) and counts how many values fall into each bin. The module [modules/histogram-bellcurve.js](https://code.highcharts.com/modules/histogram-bellcurve.js) is required for this chart.

The histogram encodes one-dimensional data. For datasets with more than one attribute, multiple histograms must be created (one per attribute).

_For more detailed samples and documentation check the [API](https://api.highcharts.com/highcharts/plotOptions.histogram)._

<iframe style="width: 100%; height: 432px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/demo/histogram" allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/histogram/) to check the code.

How to create a Histogram based on derived data
-------------------------

The histogram series is a column series with no padding between the columns and with self-setting data. The [data](https://api.highcharts.com/highcharts/series.histogram) property can be substituted by a base series (more precisely y values of the data).

**Two steps are required to create an Histogram chart:**

1. Set the series type to histogram 
2. Set baseSeries to the right data series’ id or index.

```js
series: [{
    type: histogram,
    xAxis: 1,
    yAxis: 1,
    baseSeries: 1
}, {
    data: [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4]
}]
```


Histogram chart specific options
--------------------------------

A histogram series has two additional options:

*   **binsNumber**: to suggest how many bins the histogram should create. `binsNumber` can be a number or a function which returns a number or one of the string: `square-root`, `sturges` or `rice`.
*   **binWidth**: to control the width of each bin. `binWidth` takes precedence over `binsNumber`.

For the full set of options, [see the API](https://api.highcharts.com/highcharts/plotOptions.histogram).

Histogram using pre-aggregated data
-----------------------------------

A histogram chart can also be created using a column chart if the data is already pre-aggregated.
Use the following setting to set up a histogram chart with a column chart:

```js
plotOptions: {
    column: {
        pointPadding: 0,
        borderWidth: 0,
        groupPadding: 0,
        shadow: false
    }
}
```

<iframe width="100%" height="470" style="null" src="https://www.highcharts.com/samples/embed/highcharts/series-histogram/column" allow="fullscreen"></iframe>
