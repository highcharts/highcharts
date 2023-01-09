(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: 'Human early migration paths',
            margin: 4
        },

        subtitle: {
            text: 'Source: <a href="https://www.nationalgeographic.com/culture/article/migration">National Geographic</a>'
        },

        mapView: {
            projection: {
                rotation: [-150],
                name: 'Miller'
            },
            fitToGeometry: {
                type: 'MultiPoint',
                coordinates: [
                    // Top left
                    [-20, 68.5],
                    // Bottom right
                    [-40, -45]
                ]
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            series: {
                states: {
                    inactive: {
                        enabled: false
                    }
                }
            },
            mappoint: {
                tooltip: {
                    headerFormat: '',
                    pointFormat: '{point.name}<br/>years ago'
                }
            }
        },

        series: [{
            name: 'World',
            borderColor: '#ada',
            nullColor: '#ada'
        }, {
            name: 'Points in time',
            type: 'mappoint',
            dataLabels: {
                format: '{point.id}',
                y: -7
            },
            marker: {
                symbol: 'mapmarker'
            },
            data: [{
                id: '200 KYA',
                name: '200 000',
                lon: 26,
                lat: 4,
                dataLabels: {
                    y: 0
                },
                marker: {
                    symbol: 'circle'
                }
            }, {
                id: '70-50 KYA',
                name: '70 000 - 50 000',
                lon: 46,
                lat: 24
            }, {
                id: '45-35 KYA',
                name: '45 000 - 35 000',
                lon: 11,
                lat: 45
            }, {
                id: '50 KYA',
                name: '50 000',
                lon: 135,
                lat: -25
            }, {
                id: '45-35 KYA',
                name: '45 000 - 35 000',
                lon: 110,
                lat: 32
            }, {
                id: '20-15 KYA',
                name: '20 000 - 15 000',
                lon: -165,
                lat: 62
            }, {
                id: '15-12 KYA',
                name: '15 000 - 12 000',
                lon: -65,
                lat: -20
            }],
            zIndex: 2
        }, {
            name: 'Migrations',
            color: 'tomato',
            type: 'flowmap',
            minWidth: 5,
            maxWidth: 15,
            growTowards: false,
            fillOpacity: 0.75,
            weight: 1,
            markerEnd: {
                width: '50%',
                height: '50%'
            },
            data: [{
                from: [20, 0],
                to: [46, 24],
                curveFactor: 0,
                weight: 2
            }, {
                from: [46, 24],
                to: [-3, 40],
                curveFactor: -1.2
            }, {
                from: [46, 24],
                to: [135, -25],
                curveFactor: 0.6
            }, {
                from: [97, 16],
                to: [156, 66],
                curveFactor: 0.2
            }, {
                from: [165, 66],
                to: [-65, -20],
                curveFactor: 0.6
            }],
            zIndex: 1
        }, {
            name: 'Descriptions',
            type: 'mappoint',
            marker: {
                enabled: false
            },
            enableMouseTracking: false,
            dataLabels: {
                allowOverlap: true,
                style: {
                    color: '#777',
                    textOutline: 'none',
                    fontStyle: 'italic'
                }
            },
            keys: ['lon', 'lat', 'name'],
            data: [
                [0, 15, 'Africa'],
                [72, 50, 'Eurasia'],
                [-150, 0, 'Pacific<br/>Ocean'],
                [-90, 40, 'North<br/>America']
            ]
        }]
    });
})();
