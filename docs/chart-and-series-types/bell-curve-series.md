Bell curve
===

A bell curve series is a graphical representation of a normal (Gaussian) probability distribution. Bell curve is used to visualize the probability of occurring outcomes. The curve is bell-shaped, and its center top point is the mean of the base data.

_For more detailed samples and documentation check the [API.](https://api.highcharts.com/highcharts/plotOptions.bellcurve)_

<iframe style="width: 100%; height: 500px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/bellcurve allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/bellcurve/) to check the code.

How to create a Bell Curve
--------------------------

The bell curve requires the following module [modules/histogram-bellcurve.js](https://code.highcharts.com/maps/modules/histogram-bellcurve.js).

The bell curve series is an areaspline series with self-setting data. Unlike most other Highcharts series, the [data](https://api.highcharts.com/highcharts/series.bellcurve) property is not available - it is set internally based on the base series data (more precisely y values of the data).

**Two steps are required to create a bell curve:**

1. Set the series `type` to `bellcurve`.

2. Set `baseSeries` to the right data series’ `id` or `index`.

    
        series: [{
            type: 'bellcurve',
            xAxis: 1,
            yAxis: 1,
            baseSeries: 1
        }, {
            data: [3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4]
        }]
    

Setting the Bell Curve
----------------------

A bell curve series has two additional options:

*   **intervals**: to control the length of the curve.
*   **pointsInInterval**: to control the number of points within one interval, i.e., the number of points between σn and σn+1.

The following demo visualizes four intervals for each side of the bell curve, and five points between each Nxσ:

```js
series: [{
    type: 'bellcurve',
    intervals: 4,
    pointsInInterval: 5
    ...
}]
```
    

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/plotoptions/bellcurve-intervals-pointsininterval allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/bellcurve-intervals-pointsininterval) to check the code.

The black markers indicate the borders of the intervals - four intervals for each side of the curve. Within one interval there are four markers plus the border black marker. On the left side intervals are left-closed, on the right side right-closed. The interval length is the bell curve’s standard deviation.

Additionally, there is one point at the top which is the mean of the bell curve.
