---
description: >-
  Set the map center and zoom, choose or supply a projection, and place
  insets for non-contiguous regions. The article also describes coordinate
  conversions and reading longitude and latitude from pointer events.
---

Map View and Projection
===

The map view is the basic class and options set dealing with how the map is projected and displayed inside the chart.

 * [API options](https://api.highcharts.com/highmaps/mapView)
 * [Class reference](https://api.highcharts.com/class-reference/Highcharts.MapView)

### Center and zoom
By default, a map is centered within the plot area of the chart. For custom zoom and placement, use the [center](https://api.highcharts.com/highmaps/mapView.center) and [zoom](https://api.highcharts.com/highmaps/mapView.zoom) options, where `center` is given as `[longitude, latitude]` and `zoom` is a number where 0 renders the world as 256x256 pixels, and increase of 1 zooms in to a quarter of the viewed area.

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/maps/mapview/center-zoom" allow="fullscreen"></iframe>

### Projection
The map view also controls the map's projection settings. Highcharts Maps includes some basic built-in projections, other projections can be [custom built and plugged in](https://www.highcharts.com/samples/maps/mapview/projection-custom-proj4js). By default, Highcharts will guess the best projection to use for a map, based on the geographic extent. For more details see the [API docs](https://api.highcharts.com/highmaps/mapView.projection) or try out the Projection Explorer below.

<iframe style="width: 100%; height: 900px; border: none;" scrolling="yes" src="https://www.highcharts.com/samples/embed/maps/demo/projection-explorer" allow="fullscreen"></iframe>

### Insets
Insets are small maps that are inset in parts of the main map. Highcharts Maps typically uses insets for rendering non-contiguous areas of a country closer to the mainland. Examples are Alaska and Hawaii for the USA, or the France map with multiple overseas territories. Many of the TopoJSON maps of the Map Collection come with built-in recommended `mapView` settings, where insets are included. These recommended insets can all be overridden by supplying options with the same `id`. By overriding them, the insets can for example be placed in different areas of the main map. For more details, see the general [insetOptions](https://api.highcharts.com/highmaps/mapView.insetOptions) and the item specific [insets](https://api.highcharts.com/highmaps/mapView.insets).

<iframe style="width: 100%; height: 470px; border: none;" src="https://www.highcharts.com/samples/embed/maps/mapview/insets-extended" allow="fullscreen"></iframe>

### Coordinate systems
A map view operates with three different coordinate systems:

* The geographic coordinates
* The projected plane on which the geographic coordinates are projected, and
* The pixel positions within the plot area, onto which the projected plane is scaled and translated.

The [MapView class](https://api.highcharts.com/class-reference/Highcharts.MapView) contains conversion functions between these coordinate systems. In addition to that, all pointer events are extended with `lon` and `lat` properties, allowing longitude and latitude to be read directly from for example a click event.

### Updating the view at runtime

Use [`setView`](https://api.highcharts.com/class-reference/Highcharts.MapView#setView)
to change the map's center and zoom. For example,
`chart.mapView.setView([2.35, 48.86], 5)` centers the map on Paris at zoom level 5.

To observe changes made by `setView`, including those from built-in pan and zoom,
register a listener with `Highcharts.addEvent(chart.mapView, 'afterSetView', handler)`.
The event fires synchronously after the center and zoom are updated and before
the optional redraw, even when `redraw` is `false`.

The [map flight example](https://www.highcharts.com/samples/maps/mapview/after-set-view)
uses `setView` to animate the map and `afterSetView` to stop the flight when
you pan or zoom. You can also pause and resume from the current view.
