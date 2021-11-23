Map point series
================

A `mappoint` series is a special form of `scatter` series where where points are laid out on top of a map using lon and lat coordinates.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/mappoint-latlon" allow="fullscreen"></iframe>

Therefore, it is possible here to place a [marker](https://api.highcharts.com/highmaps/plotOptions.mappoint.marker) on a specific position determined from [mappoint.data](https://api.highcharts.com/highmaps/series.mappoint.data). It may be useful as in the case of the above demo, e.g. when marking cities. We can set these positions with the values of [lat](https://api.highcharts.com/highmaps/series.mappoint.data.lat) and [lon](https://api.highcharts.com/highmaps/series.mappoint.data.lon) coordinates. The nice thing about using [geometry](https://api.highcharts.com/highmaps/series.mappoint.data.geometry) in this case is that it is directly compliant to GeoJSON feature collections and TopoJSON geometries, so that these can be used directly either as [data](https://api.highcharts.com/highmaps/series.mappoint.data) or [mapData](https://api.highcharts.com/highmaps/series.mappoint.mapData).

API Reference
=============

You can find more available options and information in the [API](https://api.highcharts.com/highmaps/series.mappoint).