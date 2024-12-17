3D funnel
===

Funnel 3D series type is the 3D variant of the [Funnel Chart](https://www.highcharts.com/docs/chart-and-series-types/funnel-series). Funnel Chart is mostly used to display the different stages in the sales process with having qualified leads on the top and closed deals at the bottom. A business is bound to lose a number of potential deals for each phase in the sales process, and that is why a typical funnel has a high number of leads at the top where the funnel narrows as more clients drop off. Funnel Chart is used to see how effective a sales team can turn leads into closed deals.

<iframe style="width: 100%; height: 532px; border: none;" src=https://www.highcharts.com/samples/embed/highcharts/demo/funnel3d allow="fullscreen"></iframe>

Setting up
----------

The Funnel 3D chart requires `highcharts.js` to be loaded first and after that, load successively `highcharts-3d.js`, `modules/cylinder.js`, `modules/funnel3d.js`.

The 3D perspective is enabled by setting `options3d.enabled` to [true](https://api.highcharts.com/highcharts/chart.options3d.enabled). Set the chart type or the data series type to `funnel3d` ([API](https://api.highcharts.com/highcharts/chart.type)) or in [series options](https://api.highcharts.com/highcharts/series.funnel3d.type).

Configuration options
---------------------

Each segment of the 3D Funnel has a height that relates to the data point’s value. In addition, the neck's size can be set by the `neckWidth` and `neckHeight` options.

The size of the funnel fills the plot area by default, but can be configured by setting the `width` and `height` properties.

See the [API](https://api.highcharts.com/highcharts/plotOptions.funnel3d) for all other options related to the Funnel 3D Chart.
