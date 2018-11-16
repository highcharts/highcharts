# Highcharts expects point configuration to be numbers or arrays in turbo mode

This error occurs if the series.data option contains object configurations and
the number of points exceeds the turboThreshold. It can be fixed by either
setting `turboThreshold` to a higher value, or changing the point
configurations to numbers or arrays.

See
[plotOptions.series.turboThreshold](https://api.highcharts.com/highcharts#plotOptions.series.turboThreshold)
