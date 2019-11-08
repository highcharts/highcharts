Data grouping (Highstock)
===========

Data grouping replaces a sequence of data points in a series with one grouped point. The values of each grouped point is calculated from the original values of every point used. The [groupPixelWidth](https://api.highcharts.com/highstock/plotOptions.series.dataGrouping.groupPixelWidth) option defines how large the groups should be.

By default, the grouping [approximation](https://api.highcharts.com/highstock/plotOptions.series.dataGrouping.approximation) depends on the type of series:

*   Line type series use an _average_ approximation.
*   Column type series compute the _sum_.
*   Range type series compute the union's _range_.
*   OHLC type series compute the union's open, high, low and close (OHLC) values.

Grouping is activated when there are many data points in the chart. As well as increasing performance it makes it easier to spot trends in a chart.

Data grouping is a Highstock feature and is enabled by default. To see dataGrouping options see the [API reference](https://api.highcharts.com/highstock/plotOptions.series.dataGrouping).
