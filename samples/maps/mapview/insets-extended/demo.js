(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/us/us-all.topo.json'
    ).then(response => response.json());

    // Create a data value for each geometry
    const data = topology.objects.default.geometries.map((f, i) => i % 5);

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
            // Extend the recommended insets
            insets: [{
                id: 'us-alaska',
                borderPath: undefined,
                field: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [1, 75],
                            [25, 75],
                            [25, 99],
                            [1, 99],
                            [1, 75]
                        ]
                    ]
                },
                padding: '10%'
            }, {
                id: 'us-hawaii',
                borderPath: undefined,
                field: {
                    type: 'Polygon',
                    coordinates: [
                        [
                            [25, 85],
                            [40, 85],
                            [40, 99],
                            [25, 99]
                        ]
                    ]
                },
                padding: '10%'
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
