(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    // Create a data value for each geometry
    const data = topology.objects.default.geometries.map((f, i) => i % 5);

    // For the sake of this demo, delete the recommended insets. Note that this
    // is just for the sake of demonstrating how to build a complete custom
    // inset configuration. In most cases it is better extending an existing
    // one. The settings used in this demo are the same as the built-in
    // recommended options for USA.
    if (topology.objects.default['hc-recommended-mapview']) {
        delete topology.objects.default['hc-recommended-mapview'].insets;
    }

    // Initialize the chart
    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'MapView insets'
        },

        mapNavigation: {
            enabled: true
        },

        mapView: {
            insets: [{
                id: 'us-alaska',
                borderPath: {
                    type: 'MultiLineString',
                    coordinates: [
                        [
                            [0, 60],
                            [25, 80],
                            [25, 100]
                        ]
                    ]
                },

                field: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [0, 60],
                            [25, 80],
                            [25, 100],
                            [0, 100]
                        ]
                    ]
                },

                geoBounds: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [-179.5, 50],
                            [-129, 50],
                            [-129, 72],
                            [-179.5, 72]
                        ]
                    ]
                },

                padding: ['30%', '5%', 0, 0],

                projection: {
                    name: 'LambertConformalConic',
                    parallels: [55, 65],
                    rotation: [154]
                }

            }, {
                id: 'us-hawaii',
                borderPath: {
                    type: 'LineString',
                    coordinates: [
                        [
                            [25, 80],
                            [40, 92]
                        ]
                    ]
                },
                field: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [25, 80],
                            [40, 92],
                            [40, 100],
                            [25, 100]
                        ]
                    ]
                },
                geoBounds: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [-162, 23],
                            [-152, 23],
                            [-152, 18],
                            [-162, 18]
                        ]
                    ]
                },
                padding: ['30%', '20%', 0, '10%'],
                projection: {
                    name: 'LambertConformalConic',
                    parallels: [8, 18],
                    rotation: [157]
                }
            }]
        },

        colorAxis: {
            tickPixelInterval: 100,
            minColor: '#F1EEF6',
            maxColor: '#900037'
        },

        series: [{
            data,
            joinBy: null,
            name: 'Random data',
            dataLabels: {
                enabled: true,
                format: '{point.properties.postal-code}'
            }
        }]
    });
})();
