# Map series

<iframe style="width: 100%; height: 520px; border: none;" src="https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/maps/demo/all-maps" allow="fullscreen"></iframe>

## Initialize the constructor

When setting the `mapChart` constructor, the default series `type` is `map`.
If the `type` option is not specified, it is inherited from `chart.type`.
For an overview of the `map` series options see the [API reference](https://api.highcharts.com/highmaps/series.map).

    Highcharts.mapChart('container', {
       ...
    });

<iframe style="width: 100%; height: 520px; border: none;" src="https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/maps/demo/category-map/" allow="fullscreen"></iframe>

## Load the map

Highcharts Maps loads its maps from GeoJSON.
A more detailed instruction on how to work with it is written here: [Load the map](https://www.highcharts.com/docs/maps/getting-started#load-the-map)

## Add and join data

In this [link](https://www.highcharts.com/docs/maps/getting-started#add-and-join-data), you can find detailed descriptions of how to work with [series.map.data](https://api.highcharts.com/highmaps/series.map.data), and [series.joinBy](https://api.highcharts.com/highmaps/plotOptions.series.joinBy).

You can also find there another way of joining the data by omitting [mapData](https://api.highcharts.com/highmaps/series.map.mapData) and setting the [path](https://api.highcharts.com/highmaps/series.map.data.path) directly on the data point.
