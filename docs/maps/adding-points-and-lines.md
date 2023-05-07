Adding points and lines
===

Map points and lines are added to the map by points or arrays of longitude and latitude. Highcharts Maps since v10 uses the GeoJSON `geometry` definitions for defining points and linestrings:

### Map point definition

For a _map point_ data point, the shorthand point configuration is to set the `lon` and `lat` properties directly in the options.

```js
{
    type: 'mappoint',
    data: [{
        lon: 4.90,
        lat: 53.38,
        name: 'Amsterdam'
    }, {
        lon: -118.24,
        lat: 34.05,
        name: 'LA'
    }]
}
```

The long configuration is to add a `geometry` where the `coordinates` is a tuple of longitude and latitude, and the type is `Point`. The reason why Highcharts supports both forms, is that the `geometry` definition allows applying maps directly from GeoJSON and TopoJSON sources.

```js
{
    type: 'mappoint',
    data: [{
        geometry: {
            type: 'Point',
            coordinates: [4.90, 53.38]
        },
        name: 'Amsterdam'
    }, {
        geometry: {
            type: 'Point',
            coordinates: [-118.24, 34.05]
        },
        name: 'LA'
    }]
}
```

### Map line definition

For map lines, add a `geometry` of type `LineString` or `MultiLineString`. When `LineString`, the `coordinates` should be a two-dimensional array of longitude-latitude tuples, while a `MultiLineString` requires a three-dimensional `coordinates` array.

Note that, depending on the projection, a map line between two points may render as a curve. This is because Highcharts renders the _geodesic_, the shortest path between two points on the Earth's surface.

```js
{
    type: 'mapline',
    data: [{
        geometry: {
            type: 'LineString',
            coordinates: [
                [4.90, 53.38], // Amsterdam
                [-118.24, 34.05] // Los Angeles
            ]
        }
    }]
}
```

### Demos

The above `geometry` examples can be viewed live in the [Projection Explorer](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/maps/demo/projection-explorer/), where the geodesic rendering is also shown. The [mapline series type](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/maps/chart/type-mapline/) main demo shows how mapline geometries are loaded from a TopoJSON map source.


### Legacy
Prior to v10, the coordinate system used in most of our maps was a custom one, where both the X and Y values ranged from 0 to some thousands. This still applies when loading GeoJSON maps rather than TopoJSON maps from the [Map Collection](https://code.highcharts.com/mapdata/). With the support of the _proj4js_ library, points could be placed by the `lon` and `lat` options. Without proj4.js, points were added as x, y pairs on the same coordinate system as the map. Maplines however were given as paths.