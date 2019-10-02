Heatmap
===

A heat map is a graphical representation of data where the individual values contained in a matrix are represented as colors.

<iframe style="width: 100%; border: none; height: 500px;" src=https://www.highcharts.com/samples/embed/highcharts/demo/heatmap allow="fullscreen"></iframe>

### Setting up the heat map series

Heat maps require the [modules/heatmap.js](https://code.highcharts.com/modules/heatmap.js) file to be loaded.

The heat map series is defined by setting the type to `heatmap`. A heat map has an X and Y axis like any cartesian series. The point definitions however, take three values, `x`, `y` as well as `value`, which serves as the value for color coding the point. These values can also be given as an array of three numbers.

### The color axis

Heat maps borrow a central concept from Highmaps, the color axis. See the docs article on [color axis](/docs/maps/color-axis/) for details

### Resources

See the featured demos at [Heat map](demo/heatmap/) and [Large heatmap](demo/heatmap-canvas/). The latter demonstrates how a HTML5 canvas can be plugged in to optimize rendering times.

See [heatmap](https://api.highcharts.com/highmaps/plotOptions.heatmap) in the Highmaps docs.
