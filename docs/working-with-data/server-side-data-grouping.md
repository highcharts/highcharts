Server-side data grouping
===

Since Highcharts version 7.1 it is possible to perform data grouping on the server side in a node environment. Client-side data grouping has been a part of Highstock since its beginning, but there are cases where it is beneficial to move the grouping to the server.

Server-side grouping means less data has to be pushed over the network, and less processing has to be performed in the client browser. On the downside, if the chart has to poll the server for new data every time a user zooms in or out, it may be perceived as non-performant. The Highstock [lazy-loading demo](https://www.highcharts.com/stock/demo/lazy-loading), although it doesn't use our node server-side grouping, shows the concept of separate loading data for different resolutions.

Setting it up in node
---------------------

An example node script can be found in [test/node-datagrouping](https://github.com/highcharts/highcharts/blob/67b64d7e0fe7332e89f53ebb49a73321d10c0e77/test/node-datagrouping.js). It generates an example data set with hourly resolution, then runs two operations:

1.  Get the `groupPositions`. Since this is time-based data, we use the `Highcharts.Time` object to find a nice distribution of ticks. The `getTimeTicks` function takes a normalized tick interval, a minimum value, and a maximum value and generates an array of evenly distributed ticks on round dates. In the example case, all ticks land on midnights.
2.  Group the data. The `groupData` function takes the raw X data, Y data, and the `groupPositions`, and group the data into the given positions. Y data can be two-dimensional if we're dealing with range or ohlc data. The `groupData` function takes an argument, `approximation` that dictates how the grouping should be done. The default is `average`, but there are also options like `sum`, `range` or `ohlc`. A function can also be passed for custom approximation. Read more in the [API](https://api.highcharts.com/highstock/series.line.dataGrouping.approximation).