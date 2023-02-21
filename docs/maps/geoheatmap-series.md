GeoHeatMap Series
=================

A GeoHeatMap series is a graphical representation of data on different map projections where the individual values contained in a matrix are represented as colors.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/geoheatmap-series" allow="fullscreen"></iframe>

GeoHeatMap similarly as regular [HeatMap](https://www.highcharts.com/docs/chart-and-series-types/heatmap) is commonly used to visualize hot spots within data sets, and to show patterns or correlations but this time the matrix respects the actual coordinates. Due to their compact nature, they are often used with large sets of data.

### Setting up the geo heat map series

Geo Heat Maps require the [modules/geoheatmap.js](https://code.highcharts.com/modules/geoheatmap.js) file to be loaded.

The geoheatmap series is defined by setting the type to `geoheatmap`. A geoheatmap has an longitude and latitude to define the positions on a grid of a actual map. The point definitions however, take three values, `lon`, `lat` as well as `value`, which serves as the value for color coding the point. These values can also be given as an array of three numbers. To determine the size of the grid, we use [colsize](https://api.highcharts.com/highmaps/series.geoheatmap.colsize) and [rowsize](https://api.highcharts.com/highmaps/series.geoheatmap.rowsize), respecting the longitude and longitude - how many units each geoheatmap point should span.

```js
series: [{
    type: 'geoheatmap',
    data: [{
        lon: 10,
        lat: 50,
        value: 5
    }],
    colsize: 10,
    rowsize: 10
}]
```

### The color axis

Heat maps borrow a central concept from Highcharts Maps, the color axis. See the docs article on [color axis](https://highcharts.com/docs/maps/color-axis/) for details.

### Resources

See [geoheatmap](https://api.highcharts.com/highmaps/plotOptions.geoheatmap) in the Highcharts Maps docs.
