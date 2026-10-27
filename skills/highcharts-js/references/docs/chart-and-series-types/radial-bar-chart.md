---
description: >-
  Create circular columns by combining polar and inverted chart settings,
  then reuse column data formats and stacking. Examples show thresholds,
  pane angles, labels, and updates with a color axis.
---

Radial (or Circular) bar chart
===

A radial (or circular) bar series visualizes columns on a polar coordinate system. Since the `xAxis` is vertical and `yAxis` is circular, as opposed to non-inverted variant, the shape of the columns is circular.

[Live demo](https://www.highcharts.com/samples/embed/highcharts/demo/polar-radial-bar)


Getting started
---------------

### Loading the required scripts

In order to create a radial bar chart, the `highcharts.js` and `highcharts-more.js` scripts are required to be loaded, just like in case of the non-inverted version of a polar chart.

### Creating a radial bar chart

To create a radial bar series, both the `chart.polar` and `chart.inverted` options must be set to `true`.

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

The format of the data is the same as in any other `column` or `bar` series. Example:

```js
series: [{
    type: 'column',
    data: [1, 2, 3, 4, 5]
}]
```

Examples of use
---------------

**Stacked two series with enabled data labels**

Just as any normal column series on a non-inverted chart, the radial bar series can also be stacked.

[Live demo](https://www.highcharts.com/samples/embed/highcharts/series-polar/column-inverted-stacking)

**Custom thresholds for the same set of data**

Setting a different `threshold` will set a new starting point for the series.

[Live demo](https://www.highcharts.com/samples/embed/highcharts/series-polar/column-inverted-threshold)

**Different start and end angles of a pane**

A custom `startAngle` and `endAngle`.

[Live demo](https://www.highcharts.com/samples/embed/highcharts/series-polar/column-inverted-endangle)

**Constantly updating series (with color axis)**

Updating points.

[Live demo](https://www.highcharts.com/samples/embed/highcharts/series-polar/column-inverted-update)
