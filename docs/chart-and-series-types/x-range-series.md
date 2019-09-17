X-range series
===

The X-range series displays ranges on the X axis, typically time intervals with a start and an end date. X-range is the basic series of a Gantt chart.

An X-range is similar to a column range, but displays ranges in the X data where the column range displays lows and highs in the Y data. This allows X-ranges to be combined with other cartesian series types.

The X-range series requires the following module [modules/xrange.js](https://code.highcharts.com/modules/xrange.js).

_For more detailed samples and documentation check the [API.](http://api.highcharts.com/highcharts/plotOptions.xrange)_

<iframe width="320" height="240" style="width: 100%; height: 332px; border: none;" src=https://www.highcharts.com/samples/view.php?path=highcharts/demo/x-range></iframe>

Click [here](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/css/x-range/) to check the code.

Data structure
--------------

Each data point in an x-range is a range from an x value (typically start date) to x2 (typically the end date). Note that dates on a Highcharts datetime axis are given as milliseconds since 1970.

The `y` value of an x-range data point sets where to draw the range vertically. On a categorized y axis, this will reflect the category index.

Each data point may have a [`partialFill`](http://api.highcharts.com/highcharts/series.xrange.data.partialFill) option that sets how much of the task is fulfilled.

See the full set of options in the [API](http://api.highcharts.com/highcharts/plotOptions.xrange).
