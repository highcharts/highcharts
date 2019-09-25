Scrollbars
===

There are two major approaches to scrollbars in Highcharts.

1. Native scrollbars for mobile
--------------------------------

These scrollbars are applied by setting a [scrollablePlotArea with a minWidth](https://api.highcharts.com/highcharts/chart.scrollablePlotArea.minWidth). When the width of the plot area becomes less than this, it is applied to a separate div in the page, where native, smooth scrolling is applied, while the axes, titles, legend and other elements stay fixed. This provides a great way to support long data series in a narrow mobile view. See the effect below in a mobile browser or just a small desktop browser window.

<iframe style="width: 100%; height: 460px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/chart/scrollable-plotarea/ allow="fullscreen"></iframe>

2. Axis scrollbars through an API option
-----------------------------------------

These scrollbars are enabled per axis and appear next to the axis. Scrollbars can be applied to any axis in Highstock.

The full documentation and available options can be seen in our [API docs](https://api.highcharts.com/highstock#yAxis.scrollbar) for Highstock.

Scrollbars are not limited to stock charts or Y axis. Using the _highstock.js_ file, it can be applied to regular Highcharts axes too. See examples of:

*   [Scrollable bar chart](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/stock/yaxis/inverted-bar-scrollbar/)
*   [Heatmap with two scrollable axes (zoom in first)](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/stock/yaxis/heatmap-scrollbars/)
*   [Scrollable Y axis on stock chart (zoom in first)](https://jsfiddle.net/gh/get/jquery/1.7.2/highcharts/highcharts/tree/master/samples/stock/yaxis/scrollbar/)

<iframe width="100%" height="450" style="border: none;" src=https://www.highcharts.com/samples/embed/stock/yaxis/inverted-bar-scrollbar allow="fullscreen"></iframe>
