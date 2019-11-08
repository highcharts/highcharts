Marker clusters
===

## Introduction
Marker clusters is the concept of sampling the data values into larger blocks in order to ease readability and increase performance. Is a simple solution to display a large number of markers on a map or a chart. The number on a cluster shows how many markers it contains. As you zoom into the map the points will start to show and the cluster will contain less markers.

The `marker-clusters` module supports `mappoint` and `scatter` series types.

**Maps demo**

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/maps/marker-clusters/europe allow="fullscreen"></iframe>

**Scatter demo**

<iframe style="width: 100%; height: 450px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/marker-clusters/basic allow="fullscreen"></iframe>

Installation
------------

Requires `modules/marker-clusters.js`. To display marker clusters, set `series.cluster.enabled` to `true`.

Configuration Options
-------------

The main marker clusters configuration is set in the `cluster property in the series options.`

|Option|Description|
|--- |--- |
|cluster.enabled|If set to true, marker clusters are enabled for the series. Defaults to false.|
|cluster.allowOverlap|When set to `false` prevent cluster overlapping - this option works only when `layoutAlgorithm.type = "grid"`.|
|cluster.animation|Options for clusters marker animation. See: https://api.highcharts.com/class-reference/Highcharts.AnimationOptionsObject|
|cluster.drillToCluster|Zoom the plot area to the cluster points range when a cluster is clicked.|
|cluster.minimumClusterSize|The minimum amount of points to be combined into a cluster.|
|cluster.layoutAlgorithm|An object containing options like a type of the algorithm, gridSize, distance or iterations.|
|cluster.layoutAlgorithm.type|Type of the algorithm used to combine points into a cluster. There are three available algorithms: `grid`, `kmeans`, `optimizedKmeans`. Type can be also set to a user custom clustering algorithm function.|
|cluster.layoutAlgorithm.gridSize|When `type` is set to the `grid`, `gridSize` is a size of a grid square element either as a number defining pixels, or a percentage defining a percentage of the plot area width.|
|cluster.layoutAlgorithm.iterations|When `type` is set to `kmeans`, `iterations` are the number of iterations that this algorithm will be repeated to find clusters positions.|
|cluster.layoutAlgorithm.distance|When `type` is set to `kmeans`, `distance` is a maximum distance between point and cluster center so that this point will be inside the cluster. The distance is either a number defining pixels or a percentage defining a percentage of the plot area width.|
|cluster.layoutAlgorithm.kmeansThreshold|When `type` is `undefined` and there are more visible points than the kmeansThreshold the `grid` algorithm is used to find clusters, otherwise `kmeans`. It ensures good performance on large datasets and better clusters arrangement after the zoom.|
|cluster.marker|Options for clusters marker. The options are the same as the default series.marker, see: https://api.highcharts.com/highcharts/plotOptions.series.marker|
|cluster.events.drillToCluster|Callback function set by a user which fires when the cluster point is clicked and `drillToCluster` is enabled.|
|cluster.zones|An array defining zones within marker clusters.|
|cluster.zones.className|Styled mode only. A custom class name for the zone.|
|cluster.zones.marker|Settings for the cluster marker belonging to the zone.|
|cluster.zones.from|The value where the zone starts.|
|cluster.zones.to|The value where the zone ends.|
|cluster.states.hover.fillColor|The fill color of the cluster marker in hover state. When `undefined`, the series' or point's fillColor for normal state is used.|
|cluster.dataLabels|Options for the cluster data labels. The options are the same as the default series.dataLabels, see: https://api.highcharts.com/highcharts/plotOptions.series.dataLabels|

Use Cases
---------

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

API document
------------

For more details check the [API document link.](https://api.highcharts.com/highcharts/scatter.cluster)