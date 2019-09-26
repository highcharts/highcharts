Zooming
=======

### Highcharts Basic

Zooming in Highcharts can be enabled on the X axes or Y axes separately. The [chart.zoomType](https://api.highcharts.com/highcharts/chart.zoomType) option is set to either `"x"`, `"y"` or `"xy"`.

With a mouse pointer, the zooming is performed by dragging out a rectangle in the chart. If the [chart.panKey](https://api.highcharts.com/highcharts/chart.panKey) is set, the user can press that key and drag the mouse in order to pan. Otherwise, the user can't pan the zoomed area but has to zoom out then in again on a new area.

When zooming, a button appears that lets the user zoom out. Programmatically, the _Chart.zoomOut_ function can be used to the same effect.

On touch devices, the user can zoom by pinching in the chart area. On these devices, the user may also move the zoomed area by panning with one finger across the chart. 

### Highstock

In Highstock, we also have the Navigator, Range Selector, and Scrollbar to ease navigation, so zooming is disabled by default. Instead, panning is enabled so that moving the zoomed area is easier. 

On touch devices, both zooming and panning are enabled through the [chart.pinchType](https://api.highcharts.com/highstock/chart.pinchType) option, which defaults to `"x"`.