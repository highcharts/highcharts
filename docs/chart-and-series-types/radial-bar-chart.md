Radial (or Circular) Bar Chart
===

A radial (or circular) bar series is a form of visualization column data on polar coordinate system. Since the `xAxis` is vertical and `yAxis` is circular, as opposed to non-inverted variant, shape of points are circular.

<iframe style="width: 100%; height: 600px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/polar-radial-bar allow="fullscreen"></iframe>

_Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/polar-radial-bar/) to check the code._

Getting started
---------------

### Loading the required scripts

In order to create radial bar chart, the `highcharts.js` and `highcharts-more.js` scripts are required to be loaded, just like in case of non-inverted version of a polar chart.

### Creating a radial bar chart

To create a radial bar series both, `polar` and `inverted`, options must be set to true.

```js
Highcharts.chart('container', {
    chart: {
        polar: true,
        inverted: true
    }
});
```

Data format
-----------

The format of data is the same as in any other `column` or `bar` series. Example:

```js
series: [{
    type: 'column',
    data: [1, 2, 3, 4, 5]
}]
```

Examples of use
---------------

**Stacked two series with enabled data labels**

Just as any normal column series on non-inverted chart, the radial bar series can also be stacked.

<iframe style="width: 100%; height: 600px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-polar/column-inverted-stacking allow="fullscreen"></iframe>

**Custom thresholds for the same set of data**

Setting a different `threshold` will set a new starting point for series.

<iframe style="width: 100%; height: 600px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-polar/column-inverted-threshold allow="fullscreen"></iframe>

**Different start and end angles of a pane**

A custom `startAngle` and `endAngle`.

<iframe style="width: 100%; height: 600px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-polar/column-inverted-endangle allow="fullscreen"></iframe>

**Constantly updating series (with color axis)**

Updating points.

<iframe style="width: 100%; height: 600px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/series-polar/column-inverted-update allow="fullscreen"></iframe>