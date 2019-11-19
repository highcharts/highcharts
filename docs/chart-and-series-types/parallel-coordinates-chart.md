Parallel coordinates
===

In cartesian charting, it is easy to show the relations between two or three dimensions. For example, scatter charts visualize the relationship between X and Y, 3D scatter charts visualize the relationships between three variables, where bubble charts show the relationship between up to four variables X, Y, Z (radius) and C (color).

Visualizing relationships with more than four dimensions become challenging with conventional charts, as they support only three dimensions. However, parallel coordinates chart can include many dimensions thanks to its capability to add many axes on one chart. Each axis is a separate series in the parallel coordinates chart, that means “line” or “spline” series can easily be added in any series. Highcharts will create all necessary yAxes, when creating chart according to the points in series.

<iframe style="width: 100%; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/parallel-coordinates allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/parallel-coordinates/) to check the code.

How to create parallel coordinates chart
----------------------------------------

Parallel coordinates chart requires the following module [modules/parallel-coordinates.js](https://code.highcharts.com/modules/parallel-coordinates.js).

Here are the steps to create a parallel coordinates chart:

1. set `chart.parallelCoordinates` to `true`:

```js
chart: {
  parallelCoordinates: true
}
```
    

2. Highcharts generates all necessary yAxes according to the dataset, and `xAxis.categories` includes the yAxes’ titles:

```js
xAxis: {
  categories: ['Title 1', 'Title 2', 'Title 3', ... , 'Title N'],
  labels: {
    styles: {
      color: '#DFDFDF' // changes titles colors
    }
  }
}
```

3. Each yAxis can be customized separately:

```js
yAxis: [{
  lineWidth: 2
}, {
  tickInterval: 10
},
  ...
]
```

4. Use `chart.parallelAxes` to set general configurations to all yAxis such as `lineWidth`, `lineColor`, etc.

    
```js
chart: {
  parallelAxes: {
    tickAmount: 10 // all non-categorized axes will have exactly ten ticks
  }
}
```

Keep in mind that `yAxis: [ ... ]` options have higher priority than `chart.parallelAxes`.

Parallel coordinates chart specific options
-------------------------------------------

*   **chart.parallelCoordinates**: Enable this option to create Parallel Coordinates Chart.
*   **chart.parallelAxes**: This option is used to configure all yAxis at once.
*   **yAxis.tooltipValueFormat**: Use this option to personalize the tooltip for point.y and available in [tooltip.pointFormat](https://api.highcharts.com/highcharts/tooltip.pointFormat) as `{point.formattedValue}`.
