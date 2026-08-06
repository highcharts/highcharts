Scatter chart
=============

A scatter chart draws a single point for each point of data in a series without connecting them.

<iframe style="width: 100%; height: 480px; border: none;" src="https://www.highcharts.com/samples/embed/highcharts/demo/scatter" allow="fullscreen"></iframe>

Scatter chart features
----------------------

An important distinction between a scatter series and a line series is that the scatter series doesn't require sorting because the mouse tracker for the tooltip is activated on each single marker. A line can be drawn between the markers by setting the lineWidth option to something higher than 0.

For an overview of the scatter chart options see the [API reference](https://api.highcharts.com/highcharts/plotOptions.scatter).

Jittering
---------

Jittering can be very useful for some charts using scatter points. Sometimes the data displayed are one dimensional, and would appear as a single line on the chart. Jitter helps separate the datapoints from each other making the properties of the series more apparent.

See an [example](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/demo/scatter-jitter/) of Jittering.

Clustering
----------

Scatter charts are especially useful for visualizing clustered data. Adding functions to cluster data into points combined with individual coloring of points in a series makes cluster visualization trivial.

See an [example](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/series-scatter/scatter-cluster/) of Clustering.

3D scatter charts
-----------------

In 3D charts, the scatter points also have a Z dimension. This is handled by a separate series type, [scatter3D](https://api.highcharts.com/highcharts/plotOptions.scatter3d).