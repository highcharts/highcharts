Map line series
===============

A `mapline` series is a special case of the map series where the value colors are applied to the strokes rather than the fills. 
It can also be used for freeform drawing, like separators, in the map.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/mapline-mappoint" allow="fullscreen"></iframe>

Configuration
-------------

To create a `mapLine` series it is necessary to set the series `type` as [mapline](https://api.highcharts.com/highmaps/series.mapline).
More information about data formatting and available options can be found in the [API](https://api.highcharts.com/highmaps/series.mapline.data). 
As you can see in the demo above we can create `mapLine` series in combination with a standard `map` series, then plot our shape data via the [path](https://api.highcharts.com/highmaps/series.mapline.data.path) option. For map and mapline series types we can also use the [geometry](https://api.highcharts.com/highmaps/series.map.data.geometry.coordinates) of a point which are GeoJSON and TopoJSON compliant. To achieve a better separation between the structure and the data, it is recommended to use [mapData](https://api.highcharts.com/highmaps/series.mapline.mapData) to define the `geometry` instead of defining it on the data points themselves. This opens up many possibilities for the mentioned drawing of non-standard shapes.

The geometry object is compatible to that of a `feature` in geoJSON, so features of geoJSON can be passed directly into the `data`, optionally after first filtering and processing it.


A more advanced demo with customized line shapes to indicate flight routes
--------------------------------------------------------------------------

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/flight-routes" allow="fullscreen"></iframe>