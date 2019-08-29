# Highcharts already defined in the page

This error happens if the `Highcharts` namespace already exists when loading 
Highcharts or Highstock.

This is caused by including Highcharts or Highstock more than once.

Keep in mind that the `Highcharts.Chart` constructor and all features of
Highcharts are included in Highstock, so if using the `Chart` and
`StockChart` constructors in combination, only the `highstock.js` file is required.
