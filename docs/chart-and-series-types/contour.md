Contour
===

A contour chart is a visualization of a continuous surface, where lines (and
optionally filled bands) represent equal values, like elevation or intensity.

<iframe style="width: 100%; border: none; height: 500px;" src="https://www.highcharts.com/samples/embed/highcharts/demo/contour-mountain" allow="fullscreen"></iframe>

### Requirements

The contour series is rendered using WebGPU technology. As of writing, this is
not generally supported by all modern browsers. See [Can I use
WebGPU](https://caniuse.com/webgpu) for an updated support table.


### Setting up the contour series

Contour charts require the [modules/contour.js](https://code.highcharts.com/modules/contour.js)
file to be loaded.

The contour series is defined by setting the type to `contour`. Each point
requires `x`, `y`, and `value`, either as an object or as a three-element array.

### The color axis

Contours use the color axis to map values to colors. See the docs article on
[color axis](https://highcharts.com/docs/maps/color-axis/) for details.

### Contour line options

Use [contourInterval](https://api.highcharts.com/highcharts/plotOptions.contour.contourInterval)
and [contourOffset](https://api.highcharts.com/highcharts/plotOptions.contour.contourOffset)
to control the spacing and alignment of contour lines. To show or hide the
lines, modify the [lineWidth](https://api.highcharts.com/highcharts/plotOptions.contour.lineWidth).
You can also enable [smoothColoring](https://api.highcharts.com/highcharts/plotOptions.contour.smoothColoring)
for a smoother gradient between levels.

### Resources

See the featured demos at [Contour mountain](https://highcharts.com/demo/contour-mountain/) and
[Contour time-series](https://highcharts.com/demo/contour-timeseries/).

See [contour](https://api.highcharts.com/highcharts/plotOptions.contour) in the
Highcharts API docs.
