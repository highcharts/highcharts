Vector plot
===

A vector plot is a type of cartesian chart where each point has an X and Y position, a length, and a direction. Vectors are drawn as arrows.

_For more detailed samples and documentation check the [API.](https://api.highcharts.com/highcharts/plotOptions.vector)_

<iframe style="width: 100%; height: 532px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/vector-plot allow="fullscreen"></iframe>

Click [here](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/vector-plot/) to check the code.

Data structure
--------------

Each vector data point is defined as `[x, y, length, direction]`.

The length is the relative length of the vector compared to the other vectors. The actual vectors are then rendered so that the [`vectorLength`](https://api.highcharts.com/highcharts/plotOptions.vector.vectorLength) option defines the pixel length of the longest vector, and the other vectors are relative to the longest vector.

The direction is given in degrees 0-360, where 0 is north, the arrow pointing downwards.

Other options
-------------

The [rotationOrigin](https://api.highcharts.com/highcharts/plotOptions.vector.rotationOrigin) option sets the vector’s point of rotation that could be the center (by default), the tile, or the head. `rotationOrigin` also sets the rotation direction (left or right). See the [API](https://api.highcharts.com/highcharts/plotOptions.vector) for full documentation.
