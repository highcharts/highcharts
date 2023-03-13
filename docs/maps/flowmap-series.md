Flow map
===============

A flow map is a series type that allows to display route paths (e.g. flights or ships routes) or flows (e.g. import/export between regions) on a map.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/flowmap" allow="fullscreen"></iframe>

Setting the Flow Map Series
----------------------------------
In the above example, our map data is based on regions, so we need to load and add a base map first:
```js
const topology = await fetch(
    'https://code.highcharts.com/mapdata/custom/world.topo.json'
).then(response => response.json());
```

```js
chart: {
    map: topology
}
```

Then you can add the [mappoint](https://api.highcharts.com/highmaps/series.mappoint) series which will be the base series responsible for connecting the flowmap to specific map points (nodes):
```js
series: [{
    type: 'mappoint',
    name: 'Cities',
    data: [{
          id: 'Oslo',
          lat: 60.1975501,
          lon: 11.1004152,
        }, {
          id: 'Warszawa',
          lat: 52.169192,
          lon: 20.973514
        },
        ...
    ],
    ...
}]
```

The last step is to add our flow map series configuration with [series.type](https://api.highcharts.com/highmaps/series.flowmap.type) set to `'flowmap'`. If you choose to use the data points from [mappoint](https://api.highcharts.com/highmaps/series.mappoint) series, they will be connected by their [id](https://api.highcharts.com/highmaps/series.mappoint.id), otherwise simple `[longitude, latitude]` coordinates can be used for the end points. The important options that you may notice in the example below are [curveFactor](https://api.highcharts.com/highmaps/series.flowmap.data.curveFactor) and [markerEnd](https://api.highcharts.com/highmaps/series.flowmap.data.markerEnd):
```js
series: [{
    type: 'flowmap',
    name: 'Flowmap with mappoint series',
    data: [{
        from: 'Warszawa',
        to: 'Oslo',
        curveFactor: 0.4,
        weight: 5,
        growTorwards: true,
        markerEnd: {
            enabled: true,
            height: 15,
            width: 10
        }
        ...
    }],
    ...
}]
```

Alternatively, you can omit the creation of [mappoint](https://api.highcharts.com/highmaps/series.mappoint) series, and create the flows directly with `[longitude, latitude]` coordinates specified in from/to properties.
```js
series: [{
    type: 'flowmap',
    name: 'Flowmap with lon/lat coordinates',
    data: [
        {
            from: [52.2662, 20.9969],
            to: [59.9170, 10.7511]
        },
        ...
    ],
    ...
}]
```

API Reference
-------------
For an overview of the flowmap map series options see the [API reference](https://api.highcharts.com/highmaps/series.flowmap).