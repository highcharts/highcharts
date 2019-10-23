3D pyramid
===

Pyramid 3D series type is a 3D variant of the [Pyramid Chart](https://www.highcharts.com/demo/pyramid). It represents data in the same way as a [Funnel Chart](https://www.highcharts.com/docs/chart-and-series-types/funnel-series) but reversed and without a neck width and neck height. Use this chart type for displaying percentage ratio or for visualizing volumes in different phases.

<iframe style="width: 100%; height: 532px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/pyramid3d allow="fullscreen"></iframe>

Setting up
----------

Pyramid 3D is part of the Highcharts library. Load first `highcharts.js` and then sequentially the following files: `highcharts-3d.js`, `modules/cylinder.js`, `modules/funnel3d.js`, and `modules/pyramid3d.js`.

The 3D perspective will be enabled by setting `options3d.enabled` to [true](https://api.highcharts.com/highcharts/chart.options3d.enabled).

Series type could be set on [chart level](https://api.highcharts.com/highcharts/chart.type) or in [series options](https://api.highcharts.com/highcharts/series.pyramid3d.type).

Configuration options
---------------------

Each segment of the 3d pyramid has a height that relates to the data point’s value. The size of the pyramid fills the plot area by default but can be configured by setting the `width` and `height` properties.

See the [API](https://api.highcharts.com/highcharts/plotOptions.pyramid3d) for all other options related to the Pyramid 3d Chart.
