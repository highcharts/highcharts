Wind barbs
===

Wind barbs visualize wind speed and direction in one graphical form. The stem direction defines the wind direction, while the barbs’ numbers and shapes define the wind speed.

_For more detailed samples and documentation check the [API.](http://api.highcharts.com/highcharts/plotOptions.windbarb)_

<iframe width="320" height="240" src="https://www.highcharts.com/samples/view.php?path=highcharts/demo/windbarb-series"></iframe>

Click [here](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/windbarb-series/) to check the code.

Data structure
--------------

Each wind barb point has an `x`, a `value`, and a `direction`.

The `value` sets the wind speed in meter per second. The resulting graphic, by convention, adds a full barb for each 10 knots (5,14 m/s) and a half barb for each 5 knots (2.57 m/s).

The `direction` is given in degrees, where 0 is a northerly wind, pointing towards the south.

Other options
-------------

*   **onSeries**: allows drawing the wind barb next to another series in the chart, typically a line or area series representing the wind speed. Otherwise, it is rendered on top of the X axis. For more details click [here](https://api.highcharts.com/highcharts/plotOptions.windbarb.onSeries).
*   **vectorLength**: sets the pixel length of the stems. For more details click [here](https://api.highcharts.com/highcharts/plotOptions.windbarb.vectorLength).
*   **yOffset** is a pixel offset, preventing the barbs from covering the underlying series or axis. For more details click [here](https://api.highcharts.com/highcharts/plotOptions.windbarb.yOffset).

See the full set of options in the [API](https://api.highcharts.com/highcharts/plotOptions.windbarb).
