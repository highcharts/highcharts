Flow map
===============

A flow map is a series type that allows to display route paths (e.g. flights or ships routes) or flows on a map.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/flowmap" allow="fullscreen"></iframe>

Setting the Flow Map Series
----------------------------------
In the above example, our map data is based on regions, so we need to load and add a base map firs:
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

Then we need to add the [mappoint](https://api.highcharts.com/highmaps/series.mappoint) series which will be the base series responsible for connecting the flowmap to specific coordinates (nodes):
```js
series: [{
    type: 'mappoint',
    name: 'Cities',
    data: [{
          id: "Oslo",
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

Last step is to add our flow map series config. The [series.type](https://api.highcharts.com/highmaps/series.flowmap.type) has to be set to `'flowmap'` and the data points will be connected with [id](https://api.highcharts.com/highmaps/series.mappoint.id). The important options that you may notice in the example below are [curveFactor](https://api.highcharts.com/highmaps/series.flowmap.data.curveFactor) and [markerEnd](https://api.highcharts.com/highmaps/series.flowmap.data.markerEnd):
```js
series: [{
    type: 'flowmap',
    name: 'Export',
    data: [
        ['Warszawa', 'Oslo', 0, 5, true, {
            enabled: true,
            height: 15,
            width: 10
        }],
        ...
    ],
    ...
}]
```

API Reference
-------------
For an overview of the flowmap map series options see the [API reference](https://api.highcharts.com/highmaps/series.flowmap).