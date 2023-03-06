(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world-continents.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology,
            margin: 1
        },

        title: {
            text: 'Early human migration paths',
            margin: 4,
            align: 'left',
            style: {
                textOutline: '5px contrast'
            }
        },

        subtitle: {
            text: 'Source: <a href="https://www.nationalgeographic.com/culture/article/migration">National Geographic</a>',
            align: 'left',
            style: {
                textOutline: '5px contrast'
            }
        },

        mapView: {
            projection: {
                rotation: [-150],
                name: 'Miller'
            },
            fitToGeometry: {
                type: 'MultiPoint',
                coordinates: [
                    // Left
                    [-20, 20],
                    // right
                    [-35, 20]
                ]
            }
        },

        legend: {
            enabled: false
        },

        accessibility: {
            point: {
                valueDescriptionFormat: '{xDescription}.'
            }
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
            },
            flowmap: {
                tooltip: {
                    pointFormat: '{point.options.from} \u2192 {point.options.to}'
                }
            }
        },

        series: [{
            name: 'World',
            borderWidth: 0,
            nullColor: '#baa',
            opacity: 0.7
        }, {
            name: 'Points in time',
            type: 'mappoint',
            dataLabels: {
                format: '{point.id}',
                y: -7,
                color: 'contrast'
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
            color: 'rgb(205, 91, 147)',
            type: 'flowmap',
            accessibility: {
                point: {
                    valueDescriptionFormat:
                        'Origin: {point.options.from:.2f}, Destination: {point.options.to:.2f}.'
                },
                description:
                    'This is a map showing where early humans migrated.'
            },
            minWidth: 5,
            maxWidth: 15,
            growTowards: false,
            fillOpacity: 1,
            opacity: 0.8,
            weight: 1,
            markerEnd: {
                width: '50%',
                height: '50%'
            },
            data: [{
                from: [20, 0],
                to: [46, 24],
                curveFactor: 0,
                weight: 2,
                color: {
                    linearGradient: { x1: 0, y1: 1, x2: 1, y2: 0 },
                    stops: [
                        [0.25, 'rgba(205, 91, 147, 0)'],
                        [0.5, 'rgb(205, 91, 147)']
                    ]
                }
            }, {
                from: [46, 24],
                to: [-3, 40],
                curveFactor: -1.2,
                color: {
                    linearGradient: { x1: 1, y1: 1, x2: 0, y2: 0 },
                    stops: [
                        [0.25, 'rgba(205, 91, 147, 0)'],
                        [0.5, 'rgb(205, 91, 147)']
                    ]
                }
            }, {
                from: [46, 24],
                to: [135, -25],
                curveFactor: 0.6,
                color: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
                    stops: [
                        [0.1, 'rgba(205, 91, 147, 0)'],
                        [0.2, 'rgb(205, 91, 147)']
                    ]
                }
            }, {
                from: [102, 24],
                to: [156, 66],
                curveFactor: 0.2,
                color: {
                    linearGradient: { x1: 0, y1: 1, x2: 1, y2: 0 },
                    stops: [
                        [0.05, 'rgba(205, 91, 147, 0)'],
                        [0.2, 'rgb(205, 91, 147)']
                    ]
                }
            }, {
                from: [165, 66],
                to: [-65, -20],
                curveFactor: 0.6,
                color: {
                    linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0.5 },
                    stops: [
                        [0.05, 'rgba(205, 91, 147, 0)'],
                        [0.2, 'rgb(205, 91, 147)']
                    ]
                }
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
                color: 'contrast',
                style: {
                    textOutline: 'none',
                    fontStyle: 'italic',
                    opacity: 0.4
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
