Map line series
===============

A `mapLine` series is a special case of the map series where the value colors are applied to the strokes rather than the fills. 
It can also be used for freeform drawing, like dividers, in the map.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/mapline-mappoint" allow="fullscreen"></iframe>

Configuration
-------------

To create a `mapLine` series it is necessary to set the series `type` as [mapline](https://api.highcharts.com/highmaps/series.mapline).
More information about data formatting and available options can be found in the [API](https://api.highcharts.com/highmaps/series.mapline.data). 
As you can see in the demo above we can create `mapLine` series in combination with a standard `map` series, then plotting our shape data via the [path](https://api.highcharts.com/highmaps/series.mapline.data.path) option. This opens up many possibilities for the mentioned drawing of non-standard shapes.

    Highcharts.mapChart('container', {
        series: [{
            // specific options for this series instance
            type: 'mapline'
        }, {
            // specific options for this series instance
            type: 'map'
        }]
    });

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/demo/maps/flight-routes" allow="fullscreen"></iframe>