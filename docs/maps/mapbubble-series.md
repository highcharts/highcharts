Map Bubble
==========

The MapBubble series is a combination of the standard bubble chart and map, where each bubble point is displayed over a specific map point shape.

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/map-bubble" allow="fullscreen"></iframe>

Setting the Map Bubble Series
-----------------------------
In the above example, our mapbubble data is based on regions, so we need to load and add a base map first:
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

Then we can add our mapbubble series config. The [series.type](https://api.highcharts.com/highmaps/series.mapbubble.type) has to be set to `'mapbubble'` and the data can be mapped to our main map by the [series.joinBy](https://api.highcharts.com/highmaps/series.mapbubble.joinBy) property:
```js
series: [{
    type: 'mapbubble',
    name: 'Population 2016',
    joinBy: ['iso-a3', 'code3'],
    data: [
        { code3: 'ABW', z: 105, code: 'AW' },
        { code3: 'AFG', z: 34656, code: 'AF' },
        ...
    ],
    ...
}]
```

All other information about bubble options can be found in the [standard bubble chart documentation](https://highcharts.com/docs/chart-and-series-types/bubble-series).

API Reference
-------------
For an overview of the mapbubble series options see the [API reference](https://api.highcharts.com/highmaps/series.mapbubble).