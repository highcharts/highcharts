// Based on https://github.com/topojson/topojson-specification
const topoJSONDecode = (topology, object) => {
    if (!topology.type === 'Topology') {
        return topology;
    }

    // Decode first object/feature as default
    if (!object) {
        object = Object.keys(topology.objects)[0];
    }

    const { scale, translate } = topology.transform;
    const arcsArray = topology.arcs.map(arc => {
        let x = 0,
            y = 0;
        return arc.map(position => {
            position = position.slice();
            position[0] = (x += position[0]) * scale[0] + translate[0];
            position[1] = (y += position[1]) * scale[1] + translate[1];
            return position;
        });
    });

    const arcsToCoordinates = arcs => {
        if (typeof arcs[0] === 'number') {
            return arcs.reduce((coordinates, arc, i) => coordinates.concat(
                (arc < 0 ? arcsArray[~arc].reverse() : arcsArray[arc])
                    .slice(i === 0 ? 0 : 1)
            ), []);
        }
        return arcs.map(arcsToCoordinates);
    };

    const geojson = {
        type: 'FeatureCollection'
    };
    geojson.features = topology.objects[object].geometries
        .map(geometry => ({
            type: 'Feature',
            properties: geometry.properties,
            geometry: {
                type: geometry.type,
                coordinates: geometry.coordinates ||
                    arcsToCoordinates(geometry.arcs)
            }
        }));

    return geojson;
};


// Source: https://github.com/leakyMirror/map-of-europe
Highcharts.getJSON(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v9.2.0/samples/data/europe.topo.json',
    topology => {

        // Convert the topoJSON feature into geoJSON
        const map = topoJSONDecode(topology);
        map.copyrightUrl = 'https://github.com/leakyMirror/map-of-europe';
        map.copyrightShort = 'leakyMirror';

        // Create a dummy data value for each feature
        const data = map.features.map((f, i) => i % 5);

        // Initialize the chart
        Highcharts.mapChart('container', {
            chart: {
                map
            },

            title: {
                text: 'TopoJSON in Highcharts Maps'
            },

            mapView: {
                projection: {
                    projectionName: 'Orthographic',
                    rotation: [-15, -40]
                }
            },

            colorAxis: {
                tickPixelInterval: 100,
                minColor: '#F1EEF6',
                maxColor: '#900037'
            },

            tooltip: {
                pointFormat: '{point.properties.NAME}: {point.value}'
            },

            series: [{
                data,
                joinBy: null,
                name: 'Random data',
                states: {
                    hover: {
                        color: '#a4edba'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.properties.NAME}'
                }
            }]
        });
    }
);
