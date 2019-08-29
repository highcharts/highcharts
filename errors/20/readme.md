# Can't add object point configuration to a long data series

In Highstock, when trying to add a point using the object literal configuration
syntax, it will only work when the number of data points is below the series'
[turboThreshold](https://api.highcharts.com/highstock#plotOptions.series.turboThreshold).
Instead of the object syntax, use the Array syntax.
