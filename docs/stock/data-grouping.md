Data grouping
===========

The `dataGrouping` feature in Highcharts Stock is a reliable tool for dealing with large sets of data in a more efficient way. By grouping data points into larger chunks, it streamlines the loading and rendering process for your charts.
Data grouping replaces a sequence of data points in a series with one grouped point. The values of each grouped point is calculated from the original values of every point used.
In Highcharts Stock charts, data grouping is done based on the pixel width of the horizontal axis, specifically through the `groupPixelWidth`. Essentially, each group on the chart holds a pixel width on the x-axis, The default value varies depending on the type of the series, because it is easier to fit more points in e.g. line chart compared to column. If the `groupPixelInterval` is set to 2 pixels, this means if your chart is displayed within 1000 pixels, it can hold up to 500 data points at once, organized according to the chart's range.

```js
Highcharts.stockChart('container', {
  series: [{
    dataGrouping: {
      groupPixelWidth: 5
    },
    data: [...]
  }]
});
```


Data grouping in Highcharts Stock can be turned on or off using the enabled option. By default, it's set to true.

```js
Highcharts.stockChart('container', {
    series: [{
        dataGrouping: {
            enabled: false
        },
        data: [...]
    }]
});
```

Here is an example of a difference between two series with the same data, but one of them is grouped:

<iframe width="600" height="450" src="https://www.highcharts.com/samples/embed/stock/plotoptions/series-datagrouping-enabled" allowfullscreen></iframe>

#### Overview of the most important data grouping options

##### [Approximation](https://api.highcharts.com/highstock/plotOptions.series.dataGrouping.approximation)
With the `approximation` option, you can decide how the final value for each group should be calculated. By default it depends on the series type: 
*   Line type series use an _average_ approximation.
*   Column type series compute the _sum_.
*   Range type series compute the union's _range_.
*   OHLC type series compute the union's open, high, low and close (OHLC) values.


but you can use the custom function to calculate the final value for each group. Here is an example of custom approximation function:

<iframe width="600" height="450" src="https://www.highcharts.com/samples/embed/stock/plotoptions/series-datagrouping-approximation" allowfullscreen></iframe>

##### [Units](https://api.highcharts.com/highstock/series.line.dataGrouping.units)
The available data grouping units can be set using `units`. By default, it's an array of time units (millisecond, second, minute, hour, day, week, month, year) with their allowed multiples.


In the example below, the data grouping is set to only group data points into one, two or three days.
```js
Highcharts.stockChart('container', {
    series: [{
        dataGrouping:{
            units: [['day', [1, 2, 3]]]
        },
        data: [...]
    }]
});
```

##### [groupAll](https://api.highcharts.com/highstock/plotOptions.series.dataGrouping.groupAll)

Default behavior only groups the points within the visible range of the chart, but sometimes it's useful to group all the points. This can be achieved by setting `groupAll` to `true`.

```js
Highcharts.stockChart('container', {
  series: [{
    dataGrouping:{
      groupAll: true
    },
    data: [...]
  }]
});
```

The points that would be outside of the visible range might have an impact on the values of the visible groups.
Here is an example of a chart where you can see the difference between the two options:

<iframe width="600" height="450" src="https://www.highcharts.com/samples/embed/stock/plotoptions/series-datagrouping-groupall" allowfullscreen></iframe>


##### [forced](https://api.highcharts.com/highstock/plotOptions.series.dataGrouping.forced)

Sometimes it's useful to force the data grouping to kick in, even if all of the data points can be easily fitted into the visible range. This can be achieved by setting `forced` to `true`, while also deterimining the `units` option. This way, the series will choose the lowest available option to group the points. This can be used to smoothen the series, similar to what indicators like SMA do.

The example below shows how to force the data to be grouped into one second intervals. (the result can be seen in the first example of the page)
```js
Highcharts.stockChart('container', {
  series: [{
    dataGrouping: {
      forced: true,
      units: [['second', [1]]]
    },
    data: [...]
  }]
});
```


### The x-value for a grouped point

 <iframe width="500" height="860" src="https://www.highcharts.com/samples/embed/stock/plotoptions/series-datagrouping-first-anchor" allow="fullscreen"></iframe>

Grouped points can be positioned inside the group using [anchor](https://api.highcharts.com/highstock/plotOptions.series.dataGrouping.anchor) property which might take values: 

* `start` places the point always at the beginning of the group  (e.g. range 00:00:00 - 23:59:59 -> 00:00:00)
* `middle` places the point always in the middle of the group (e.g. range 00:00:00 - 23:59:59 -> 12:00:00)
* `end` places the point always at the end of the group (e.g. range 00:00:00 - 23:59:59 -> 23:59:59)

Additionally [firstAnchor](https://api.highcharts.com/highstock/plotOptions.series.dataGrouping.firstAnchor) and [lastAnchor](https://api.highcharts.com/highstock/plotOptions.series.dataGrouping.lastAnchor) properties can be used to position the first and the last point in the data set (not in the current zoom). In addition to the values described above, they might have values:
* `firstPoint` the first point in the group  (e.g. points at 00:13, 00:35, 00:59 -> 00:13)
* `lastPoint` the last point in the group (e.g. points at 00:13, 00:35, 00:59 -> 00:59)


### Performance comparison of data grouping

 When using data grouping, the performance of the chart is improved. The main reason is that when there are a lot of points to be displayed, the number of said points does not improve readability of the chart, and number of points that are being rendered is greatly reduced. The following chart shows the performance improvement of data grouping for a series with varying number of data points, from 10 to 100 000.

 <iframe width="800" height="400" src="https://www.highcharts.com/samples/embed/highcharts/blog/dg-performance-comparison" allow="fullscreen"></iframe>

