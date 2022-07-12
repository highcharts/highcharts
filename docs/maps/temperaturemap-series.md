Temperature map
===============

A temperature map is a series that has been created to highlight areas of the map detailing the severity of the data (e.g. population density, temperature, etc.).

<iframe style="width: 100%; height: 520px; border: none;" src="https://highcharts.com/samples/embed/maps/demo/temperaturemap" allow="fullscreen"></iframe>

Setting the Temperature Map Series
----------------------------------
In the above example, our temperature map data is based on regions, so we need to load and add a base map first, similar to the [mapbubble series](https://highcharts.com/docs/maps/mapbubble-series/setting-the-map-bubble-series):
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

Then we can add our temperature map series config. The [series.type](https://api.highcharts.com/highmaps/series.temperaturemap.type) has to be set to `'temperaturemap'` and the data can be mapped to our main map by the [series.joinBy](https://api.highcharts.com/highmaps/series.temperaturemap.joinBy) property. Thanks to [temperatureColors](https://api.highcharts.com/highmaps/series.temperaturemap.temperatureColors) we are able to set colors for each point. Can be an array of strings (if 3 colors defined, every next marker is 33.3% smaller) or an array of color stops (e.g. for `[[0.2, '# ff0000'], [1, '# 0000ff']]` the smallest top marker is 5 times smaller than the biggest bottom one).
```js
series: [{
    type: 'temperaturemap',
    name: 'Population',
    minSize: 50,
    maxSize: 200,
    opacity: 0.5,
    temperatureColors: [
        '#ff0000',
        '#ffff00',
        '#00ff00',
        '#00ffff',
        '#0000ff'
    ],
    joinBy: ['iso-a3', 'code3'],
    data: [
        { code3: 'ABW', z: 105, code: 'AW' },
        { code3: 'AFG', z: 34656, code: 'AF' },
        ...
    ],
    ...
}]
```

API Reference
-------------
For an overview of the temperature map series options see the [API reference](https://api.highcharts.com/highmaps/series.temperaturemap).