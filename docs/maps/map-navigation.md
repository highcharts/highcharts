Map navigation
===

Highcharts Maps supports different ways of navigating around the map - zooming, panning, zooming to an area etc. The API options related to this can be viewed at [mapNavigation](https://api.highcharts.com/highmaps/mapNavigation).

Please note that `mapNavigation` is disabled by default because the implementer should be concious that it may interfere with the navigation of the web page in general. When scrolling the mouse wheel over a map, the user may expect the web page to scroll, while Highcharts Maps will capture the mousewheel event and zoom the map. The same goes for touch devices, where unless used right, the map may trap the user unable to zoom out to the page outside the map. So zooming should only be enabled in cases where the map actually needs it.

### Buttons

Two buttons, [+] and [-], are by default shown on each map when navigation is enabled. These provide zooming in and zooming out.

### Multitouch

On touch devices, zooming and panning may be performed by pinch and touch-drag gestures.

### Mousewheel

Mousewheeling zooms in and out the map around the point under the mouse.

### Doubleclick

Doubleclick by default zooms in, focused on the point under the mouse. Following the [enableDoubleClickZoomTo](https://api.highcharts.com/highmaps/mapNavigation.enableDoubleClickZoomTo) option, double clicking may zoom fully in to a specific point.

### Programmatic control through MapView

Setting the map view programmatically is done through the [Chart.mapView](https://api.highcharts.com/class-reference/Highcharts.MapView) object. It can be zoomed through the `mapView.zoomBy` function or directly by [Point.zoomTo](https://api.highcharts.com/class-reference/Highcharts.Point#zoomTo) methods.
