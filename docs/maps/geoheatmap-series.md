GeoHeatMap Series
=================

A GeoHeatMap series is a graphical representation of data on different map projections where the individual values contained in a matrix are represented as colors.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/geoheatmap-europe" allow="fullscreen"></iframe>

GeoHeatMap similar to regular [HeatMap](https://www.highcharts.com/docs/chart-and-series-types/heatmap) is commonly used to visualize hot spots within data sets and to show patterns or correlations. In the GeoHeatmap, the matrix represents geographic coordinates. Due to their compact nature, they are often used with large sets of data.

### Setting Up The GeoHeatMap Series

GeoHeatMap requires the [modules/geoheatmap.js](https://code.highcharts.com/modules/geoheatmap.js) file to be loaded.

The GeoHeatMap series is defined by setting the type to `geoheatmap`. In GeoHeatMap the definitions of the point, take three values, `lon`, `lat` as well as `value`, which serves as the value for color coding the point. These values can also be given as an array of three numbers. To determine the size of the grid, we use [colsize](https://api.highcharts.com/highmaps/series.geoheatmap.colsize) and [rowsize](https://api.highcharts.com/highmaps/series.geoheatmap.rowsize), respecting the longitude and latitude - how many units each GeoHeatMap point should span.

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

GeoHeatMap series borrow a central concept from Highcharts Maps, the color axis. See the docs article on [color axis](https://highcharts.com/docs/maps/color-axis/) for details.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/geoheatmap-equalearth" allow="fullscreen"></iframe>

### Interpolation

GeoHeatMap series have an [interpolation feature](https://api.highcharts.com/highmaps/plotOptions.geoheatmap.interpolation), which allows for displaying seamlessly transitioning data points.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/geoheatmap-earth-statistics" allow="fullscreen"></iframe>

### Resources

See [geoheatmap](https://api.highcharts.com/highmaps/plotOptions.geoheatmap) in the Highcharts Maps docs.
