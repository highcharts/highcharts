# The requested series type does not exist

This error happens when setting `chart.type` or `series.type` to a
series type that isn't defined in Highcharts. A typical reason may be that the 
module or extension where the series type is defined isn't included. 

For example in order to create an `arearange` series, the
`highcharts-more.js` file must be loaded.
