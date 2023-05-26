Highcharts.getJSON(
    'https://code.highcharts.com/mapdata/custom/europe.topo.json',
    topology => {

        // Create a data value for each feature
        const data = topology.objects.default.geometries.map((f, i) => i % 5);

        // Initialize the chart
        Highcharts.mapChart('container', {
            chart: {
                map: topology
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

            series: [{
                data,
                joinBy: null,
                name: 'Random data'
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
