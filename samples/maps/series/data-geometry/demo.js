// Source: https://github.com/leakyMirror/map-of-europe
Highcharts.getJSON(
    'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v9.2.0/samples/data/europe.topo.json',
    topology => {

        // Convert the topoJSON feature into geoJSON
        const geojson = window.topojson.feature(
            topology,
            // For this demo, get the first of the named objects
            topology.objects[Object.keys(topology.objects)[0]]
        );
        geojson.copyrightUrl = 'https://github.com/leakyMirror/map-of-europe';
        geojson.copyrightShort = 'leakyMirror';

        // Create a dummy data value for each feature
        const data = geojson.features.map((f, i) => i % 5);

        // Initialize the chart
        Highcharts.mapChart('container', {
            chart: {
                map: geojson
            },

            title: {
                text: 'Map point and line geometry'
            },

            mapView: {
                projection: {
                    name: 'LambertConformalConic',
                    parallels: [43, 62],
                    rotation: [-10]
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
                }
            }, {
                type: 'mapline',
                data: [{
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [-9.139337, 38.722252], // Lisboa
                            [30.5234, 50.4501] // Kiev
                        ]
                    },
                    color: '#666'
                }],
                lineWidth: 2,
                enableMouseTracking: false
            }, {
                type: 'mappoint',
                color: '#333',
                data: [{
                    name: 'Lisboa',
                    geometry: {
                        type: 'Point',
                        coordinates: [-9.139337, 38.722252]
                    }
                }, {
                    name: 'Kiev',
                    geometry: {
                        type: 'Point',
                        coordinates: [30.5234, 50.4501]
                    }
                }],
                enableMouseTracking: false
            }]
        });
    }
);
