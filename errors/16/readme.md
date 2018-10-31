# Highcharts already defined in the page

This error happens the second time Highcharts or Highstock is loaded in the same
page, so the `Highcharts` namespace is already defined. Keep in mind that the
`Highcharts.Chart` constructor and all features of Highcharts are included in
Highstock, so if you are running `Chart` and `StockChart` in combination, you
only need to load the highstock.js file.
