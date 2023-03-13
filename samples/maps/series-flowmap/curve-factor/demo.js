(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Highcharts Maps flowmap demo with curveFactor'
        },

        mapNavigation: {
            enabled: true
        },

        accessibility: {
            point: {
                valueDescriptionFormat: '{xDescription}.'
            }
        },

        plotOptions: {
            flowmap: {
                tooltip: {
                    headerFormat: null,
                    pointFormat: `{point.options.from} \u2192
                        {point.options.to}: <b>{point.weight}</b>`
                }
            },
            mappoint: {
                tooltip: {
                    headerFormat: '{point.point.id}<br>',
                    pointFormat: 'Lat: {point.lat} Lon: {point.lon}'
                }
            }
        },

        series: [{
            name: 'Basemap',
            states: {
                inactive: {
                    enabled: false
                }
            },
            data: [
                ['pl', 1],
                ['es', 1],
                ['fr', 1],
                ['it', 1],
                ['bg', 1],
                ['fi', 1],
                ['no', 1],
                ['hu', 1],
                ['ie', 1]
            ]
        }, {
            type: 'mappoint',
            id: 'europe',
            name: 'Cities',
            dataLabels: {
                format: '{point.id}'
            },
            data: [{
                id: 'Oslo',
                lat: 59.91,
                lon: 10.76
            }, {
                id: 'Warszawa',
                lat: 52.17,
                lon: 20.97
            }, {
                id: 'Paris',
                lat: 48.73,
                lon: 2.37
            }, {
                id: 'Roma',
                lat: 41.8,
                lon: 12.6
            }, {
                id: 'Madrid',
                lat: 40.47,
                lon: -3.57
            }, {
                id: 'Dublin',
                lat: 53.43,
                lon: -6.24
            }, {
                id: 'Helsinki',
                lat: 60.32,
                lon: 24.97
            }, {
                id: 'Budapest',
                lat: 47.43,
                lon: 19.26
            }, {
                id: 'Sofia',
                lat: 42.69,
                lon: 23.4
            }]
        }, {
            type: 'flowmap',
            accessibility: {
                point: {
                    valueDescriptionFormat:
                        'Origin: {point.options.from}, Destination: {point.options.to}.'
                },
                description:
                    'This is a map demonstrating curves.'
            },
            linkedTo: ':previous',
            markerEnd: {
                enabled: false
            },
            color: '#0000FF',
            fillOpacity: 0.2,
            data: [{
                from: 'Oslo',
                to: 'Helsinki',
                curveFactor: 1
            },
            {
                from: 'Oslo',
                to: 'Dublin',
                curveFactor: -0.2
            },
            {
                from: 'Warszawa',
                to: 'Helsinki',
                curveFactor: -0.2
            },
            {
                from: 'Warszawa',
                to: 'Paris',
                curveFactor: -0.5
            },
            {
                from: 'Warszawa',
                to: 'Madrid',
                curveFactor: 0
            },
            {
                from: 'Warszawa',
                to: 'Budapest',
                curveFactor: 0.2
            }, {
                from: 'Warszawa',
                to: 'Sofia',
                curveFactor: 1
            }, {
                from: 'Warszawa',
                to: 'Roma',
                curveFactor: -0.3
            }]
        }]
    });
})();
