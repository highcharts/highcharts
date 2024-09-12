Marker clusters
===============

## Introduction
Marker clusters is the concept of sampling the data values into larger blocks in order to ease readability and increase performance. It is a simple solution to display a large number of map points on a map. The number label on a cluster graphic shows how many data points it represents. As you zoom into the map the individual points will start to show, and the cluster will contain fewer markers.

The `marker-clusters` module supports `mappoint` and `scatter` series types.

**Map demo**

<iframe style="width: 100%; height: 450px; border: none;" src="https://www.highcharts.com/samples/embed/maps/marker-clusters/europe" allow="fullscreen"></iframe>

**Map demo with optimalized K-Means algorithm**

<iframe style="width: 100%; height: 450px; border: none;" src="https://www.highcharts.com/samples/embed/maps/marker-clusters/optimized-kmeans" allow="fullscreen"></iframe>

Installation
------------

Requires `modules/marker-clusters.js`. To display marker clusters, set `series.cluster.enabled` to `true`.

API documentation
-----------------

For more details and options check the [marker-clusters in Highcharts](https://highcharts.com/docs/advanced-chart-features/marker-clusters) article and the [API documentation](https://api.highcharts.com/highmaps/series.mappoint.cluster).
