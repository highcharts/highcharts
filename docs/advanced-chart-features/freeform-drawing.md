Freeform drawing
================

Internally, Highcharts is equipped with a rendering module that acts as a wrapper for JavaScript access to SVG in modern browsers. It has much in common with drawing tools like Raphaël or SVG jQuery. This drawing module can be used either to draw shapes or text on the chart, or even as a standalone drawing tool for HTML pages.

Inside a chart, the chart's renderer object is available as _chart.renderer_. To instantiate a new SVG drawing outside Highcharts, you call new _Highcharts.Renderer(parentNode, width, height)_, where parentNode is the div or container element where you want the drawing to be placed.

The drawing API is documented in detail at [Highcharts.SVGRenderer](https://api.highcharts.com/class-reference/Highcharts.SVGRenderer) and [Highcharts.SVGElement](https://api.highcharts.com/class-reference/Highcharts.SVGElement).