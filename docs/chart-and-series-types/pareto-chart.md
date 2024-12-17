Pareto chart
===

The pareto chart is used to graphically summarize and display the relative importance of the differences between groups of data. It suggests that 80% of problems can be traced to as few as 20% of root causes.

The Pareto series is represented by a line series of datapoints extracted from a base series, which is typically a column type. Calculated values are from the range: 0% - 100% and should be assigned to additional yAxis.

_For more detailed samples and documentation check the [API.](https://api.highcharts.com/highcharts/plotOptions.pareto)_

<iframe style="width: 100%; height: 432px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/pareto allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/pareto/) to check the code.

How to create Pareto Chart
--------------------------

Pareto chart requires the following module [modules/parallel-coordinates.js](https://code.highcharts.com/modules/parallel-coordinates.js).

Here are the steps to create a Pareto chart:

1. Set an additional yAxis, which is assigned only to Pareto series, and visualize points from 0-100% range. As a result the main data and pareto series are transparent.

```js
yAxis: [{
        // main yAxis
}, {
    title: {
        text: 'Pareto'
    },
    minPadding: 0,
    maxPadding: 0,
    opposite: true,
    labels: {
        format: '{value}%'
    }
}]
```  

For more details about yAxis click on the following [link](https://api.highcharts.com/highcharts/yAxis).

2. Set a column series (sorted by y descending). Points are data source for the Pareto series.

```js
{
    type: 'column',
    data: [115, 75, 60, 55, 45, 30, 20]
}
```
    

3. Add a pareto series with an baseSeries parameter and yAxis index.

```js
series: [{
    type: 'pareto',
    yAxis: 1, // number of declared yAxis
    zIndex: 10,
    baseSeries: 1 // index of column series
}, {
    type: 'column',
    zIndex: 2,
        data: [755, 222, 151, 86, 72, 51, 36, 10]
    }  
]
```

Keep in mind that Highcharts will generate all necessary data points following its algorithm.

Keep in mind that `yAxis: [ … ]` options have higher priority than `chart.parallelAxes`.

Pareto chart options
--------------------

*   **baseSeries**: Index of a specific column series.
*   **yAxis** : Index of Pareto yAxis
