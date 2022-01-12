Marker clusters
===

## Introduction
Marker clusters is the concept of sampling the data values into larger blocks in order to ease readability and increase performance. It is a simple solution to display a large number of markers on a map, or a chart. The number on a cluster shows how many markers it contains. As you zoom into the map the points will start to show, and the cluster will contain fewer markers.

The `marker-clusters` module supports `mappoint` and `scatter` series types.
For more map related info, see the [marker-clusters in Highcharts Maps](https://highcharts.com/docs/maps/marker-clusters) article.

**Scatter demo**

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/marker-clusters/basic allow="fullscreen"></iframe>

Installation
------------

Requires `modules/marker-clusters.js`. To display marker clusters, set `series.cluster.enabled` to `true`.

Configuration Options
-------------

The main marker clusters configuration is set in the `cluster` property in the series options.

The clustering algorithm options can be set in the `cluster.layoutAlgorithm` object. There are three available algorithms that can be set in the `cluster.layoutAlgorithm.type`:

1) `grid` - grid-based clustering technique. Points are assigned to squares of set size depending on their position on the plot area. Points inside the grid square are combined into a cluster. The grid size can be controlled by the `gridSize` property (grid size changes at certain zoom levels).

2) `kmeans` - based on the K-Means clustering technique. In the first step, points are divided using the grid method (distance property is the grid size) to find the initial amount of clusters. Next, each point is classified by computing the distance between each cluster center and that point. When the closest cluster distance is lower than the distance property set by the user, the point is added to this cluster. Otherwise, it is classified as `noise`. The algorithm is repeated until each cluster center does not change its previous position more than one pixel. This technique is more accurate but also more time consuming than the `grid` algorithm, especially for big datasets.

3) `optimizedKmeans` - based on the K-Means clustering technique. This algorithm uses the K-Means algorithm only on the chart initialization or when chart extremes have greater range than on initialization. When a chart is redrawn, the algorithm checks only clustered points distance from the cluster center and rebuilds it when the point is spaced enough to be outside the cluster. It provides performance improvement and a more stable clusters position yet can be used rather on small and sparse datasets.

By default, the algorithm depends on a visible quantity of points and `kmeansThreshold`. When there are more visible points than the `kmeansThreshold` the `grid` algorithm is used, otherwise `kmeans`.

A custom clustering algorithm can be added by assigning a callback function as the type property. This function takes an array of visible points `X data`, `Y data`, `X data` indexes (in the whole data array), and `layoutAlgorithm` options as arguments and should return an object with grouped data.

The custom algorithm should return an object like this:

```js
{
  clusterId1: [{
      x: 573,
      y: 285,
      index: 1 // point index in the data array
  }, {
      x: 521,
      y: 197,
      index: 2
  }],
  clusterId2: [{
      ...
  }]
  ...
}
```

Use Cases
---------

```js
  series: [{
    type: 'scatter',
    color: 'red',
    dataLabels: {
      enabled: true,
      pointFormat: ''
    },
    cluster: {
      enabled: true,
      dataLabels: {
        style: {
          fontSize: '8px'
        },
        y: -1
      },
      allowOverlap: false,
      animation: true,
      layoutAlgorithm: {
        type: 'grid',
        gridSize: 100
      },
      zones: [{
        from: 0,
        to: 2,
        marker: {
          fillColor: '#ffcccc',
          radius: 12
        }
      }, {
        from: 3,
        to: 10,
        marker: {
          fillColor: '#ff6666',
          radius: 15
        }
      }]
    },
    data: [
      [35.79, 33.94],
      [5, 24.05],
      [20.89, 49.01],
      [6.96, 79.79],
      [21.92, 25.19],
      [16.71, 53.54],
      [6.54, 8.64],
      [5.28, 12.24],
      [16.14, 49.82],
      [80.22, 16.38],
      [31.36, 17.16],
      [9.24, 8.97],
      [66.57, 91.86],
      [17.55, 5.07],
      [54.86, 88.33],
      [6.7, 5.49],
      [53.34, 88.98],
      [5.34, 46.02],
      [18.13, 10.24],
      [7.37, 43.98]
    ]
  }]
```

API documentation
-----------------

For more details check the [API documentation](https://api.highcharts.com/highcharts/series.scatter.cluster).
