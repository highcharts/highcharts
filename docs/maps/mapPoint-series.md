Map point series
================

A `mappoint` series is a special form of `scatter` series where the points can be laid out in map coordinates on top of a map.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/demo/maps/mappoint-latlon" allow="fullscreen"></iframe>

Therefore, it is possible here to set a [marker](https://api.highcharts.com/highmaps/plotOptions.mappoint.marker) on specific position determined from [mappoint.data](https://api.highcharts.com/highmaps/series.mappoint.data). It may be useful as in the case of the above demo, e.g. when marking cities. We overwrite there the default [x](https://api.highcharts.com/highmaps/series.mappoint.data.x) and [y](https://api.highcharts.com/highmaps/series.mappoint.data.y) coordinates with the values of [lat](https://api.highcharts.com/highmaps/series.mappoint.data.lat) and [lon](https://api.highcharts.com/highmaps/series.mappoint.data.lon).

API Reference
=============

You can find more available options and information in the [API](https://api.highcharts.com/highmaps/series.mappoint).