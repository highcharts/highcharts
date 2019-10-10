Drill down
==========

For full detailed documentation and more samples of the drilldown feature, see [the Highcharts API](https://api.highcharts.com/highcharts/drilldown).

Since version 3.0.8, Highcharts has built-in support for drilldown. By giving a point configuration a drilldown option that corresponds to a series configuration in the `drilldown.series` array, the point is linked to a hidden series. When the point is clicked, this series is loaded in the chart and replaces the existing series. For column, bar and pie series, an animation occurs to help visualize that the single clicked point is extracted into a drilldown series. Multiple levels of drilling can be applied by chaining points to series.

### Basic setup

For a basic setup, the drilldown series are defined in a separate array under the `drilldown` configuration. Each series configuration is given an id, which is used for the drilldown parent point to identify its series. 

    
            series: [{
                name: 'Things',
                colorByPoint: true,
                data: [{
                    name: 'Animals',
                    y: 5,
                    drilldown: 'animals'
                }, {
                    name: 'Fruits',
                    y: 2,
                    drilldown: 'fruits'
                }, {
                    name: 'Cars',
                    y: 4,
                    drilldown: 'cars'
                }]
            }],
            drilldown: {
                series: [{
                    id: 'animals',
                    data: [
                        ['Cats', 4],
                        ['Dogs', 2],
                        ['Cows', 1],
                        ['Sheep', 2],
                        ['Pigs', 1]
                    ]
                }, {
                    id: 'fruits',
                    data: [
                        ['Apples', 4],
                        ['Oranges', 2]
                    ]
                }, {
                    id: 'cars',
                    data: [
                        ['Toyota', 4],
                        ['Opel', 2],
                        ['Volkswagen', 2]
                    ]
                }]
            }

See it [live on jsFiddle](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/drilldown/basic/).

### Async setup

In many cases you may want to load the drilldown series dynamically. In this case we set the `point.drilldown` option to true, and use the chart's drilldown event to load the drilldown series configuration based on the clicked point. When the series data arrives, we add it by calling the [Chart.addSeriesAsDrilldown](https://api.highcharts.com/highcharts/Chart.addSeriesAsDrilldown) method.

See the [async drilldown](https://jsfiddle.net/gh/get/jquery/1.7.2/highslide-software/highcharts.com/tree/master/samples/highcharts/drilldown/async/) demo.