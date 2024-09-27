Tilemaps
===

Tilemaps are maps where each area is represented by tiles of equal shape. Highcharts Maps supports four different tilemap types: Circlemap, Diamondmap, Honeycomb, and Squaremap, each with a different tile shape.

_For more detailed samples and documentation check the [API.](https://api.highcharts.com/highcharts/plotOptions.tilemap)_

Honeycomb maps
--------------

Honeycomb maps use offset hexagonal tiles in a honeycomb pattern. This is the default tilemap type.

<iframe style="width: 100%; height: 800px; border: none;" src="https://www.highcharts.com/samples/embed/maps/plotoptions/honeycomb-brazil" allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/maps/plotoptions/honeycomb-brazil/) to check the code.

Circlemaps
----------

Circlemaps use offset circular tiles.

<iframe style="width: 100%; height: 760px; border: none;" src="https://www.highcharts.com/samples/embed/maps/demo/circlemap-africa" allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/maps/demo/circlemap-africa/) to check the code.

Diamondmaps
-----------

Diamondmaps use offset `rhombus` tiles in a diamond weave pattern.

<iframe style="width: 100%; height: 510px; border: none;" src="https://www.highcharts.com/samples/embed/maps/demo/diamondmap" allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/maps/demo/diamondmap/) to check the code.

Squaremaps
----------

Square tilemaps are just Heatmap series with slightly different default values. Heatmaps are covered in detail in our [Heatmap series](https://www.highcharts.com/docs/chart-and-series-types/heatmap) article.

How to create a tilemap
-----------------------

Tilemaps require the following module [modules/tilemap.js](https://code.highcharts.com/maps/modules/tilemap.js) with Highcharts Maps only. Add also this module [modules/heatmap.js](https://code.highcharts.com/modules/heatmap.js) in case of using Highcharts.

Use the [series.tileShape](https://api.highcharts.com/highmaps/series.tilemap.tileShape) option to switch between the different tile shapes. Currently, four shapes are supported “circle”, “diamond”, “hexagon”and “square”. The default shape is “hexagon”.

Data structure
--------------

The data structure is the same for all tilemap types. `x` and `y` properties set the position of the tile on the grid, and `value` sets the value of the tile for use with a [colorAxis](https://www.highcharts.com/docs/maps/color-axis/). For more options see the [series document](https://api.highcharts.com/highmaps/series). Note that for hexagon, circle and diamond tile shapes, the grid is offset with coordinates as follows:

<iframe style="width: 100%; height: 670px; border: none;" src="https://www.highcharts.com/samples/embed/maps/series/tilemap-gridoffset" allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/samples/maps/series/tilemap-gridoffset) to check the code.

Tips
----

1. The orientation of tilemaps can be inverted by using the [chart.inverted](https://api.highcharts.com/highcharts/chart.inverted) option. For more control over offset tile positioning, also see the [xAxis.reversed](https://api.highcharts.com/highcharts/xAxis.reversed) and [yAxis.reversed](https://api.highcharts.com/highcharts/yAxis.reversed) options.

<iframe style="width: 100%; height: 590px; border: none;" src="https://www.highcharts.com/samples/embed/maps/demo/honeycomb-usa" allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/honeycomb-usa/) to check the code.

2. The spacing between points in tilemaps can be controlled with the [series.pointPadding](https://api.highcharts.com/highmaps/plotOptions.tilemap.pointPadding) option. Point padding can also be set per [point](https://api.highcharts.com/highmaps/series.tilemap.data.pointPadding).

<iframe style="width: 100%; height: 700px; border: none;" src="https://www.highcharts.com/samples/embed/maps/plotoptions/tilemap-pointpadding" allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/maps/plotoptions/tilemap-pointpadding/) to check the code.
