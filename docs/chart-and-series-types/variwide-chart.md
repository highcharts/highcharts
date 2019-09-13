Variwide chart
===

A variwide chart is a column chart where each column has a separate width to represent the third dimension. A variwide chart is related to the [Marimekko chart](https://en.wikipedia.org/wiki/Mosaic_plot), but while a Marimekko computes the width for the stack to fill the whole plot area, the variwide chart simply lets the column widths reflect a value.

_For more detailed samples and documentation check the [API.](http://api.highcharts.com/highcharts/plotOptions.variwide)_

<iframe width="320" height="240" style="width: 100%; height: 416px; border: none;" src=https://www.highcharts.com/samples/view.php?path=highcharts/demo/variwide></iframe>

Click [here](http://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/variwide/) to check the code.

Data structure
--------------

The variwide series uses two options `y` and `z`. The y option determines the height of the column, like a common column chart, and the z option determines the width of the column. Check the [API options](https://api.highcharts.com/highcharts/plotOptions.variwide) for more details.
