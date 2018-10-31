# The requested series type does not exist

This error happens when you are setting `chart.type` or `series.type` to a
series type that isn't defined in Highcharts. A typical reason may be that your
are missing the extension file where the series type is defined, for example in
order to run an `arearange` series you need to load the `highcharts-more.js`
file.
