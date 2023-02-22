(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology,
            backgroundColor: {
                radialGradient: {
                    cx: 0.5,
                    cy: 0.5,
                    r: 1
                },
                stops: [
                    [0, 'lightblue'],
                    [1, 'white']
                ]
            },
            margin: 1
        },

        title: {
            text: 'Example route of a ship from USA to China',
            align: 'left'
        },

        subtitle: {
            text: `The route through the Suez Canal. Arrow width represents the
            number of travel days between cities.`,
            align: 'left'
        },

        credits: {
            style: {
                color: 'black'
            }
        },

        mapNavigation: {
            enabled: false
        },

        mapView: {
            fitToGeometry: {
                type: 'MultiPoint',
                coordinates: [
                    // Top left
                    [-150, 70],
                    // Bottom right
                    [130, -10]
                ]
            }
        },

        legend: {
            enabled: false
        },

        plotOptions: {
            flowmap: {
                tooltip: {
                    headerFormat: null,
                    pointFormat: `{point.options.from} \u2192
                        {point.options.to}: <b>{point.weight}</b><br/>`
                }
            },
            mappoint: {
                tooltip: {
                    headerFormat: '{point.point.id}<br>',
                    pointFormat: 'Lat: {point.lat} Lon: {point.lon}'
                },
                accessibility: {
                    point: {
                        valueDescriptionFormat: '{xDescription}.'
                    }
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
            nullColor: '#8C8F8D',
            borderColor: '#8C8F8D'
        }, {
            zIndex: 2,
            type: 'mappoint',
            name: 'Cities',
            tooltip: {
                pointFormat: '{name}'
            },
            color: 'rgba(255,255,255,0.4)',
            dataLabels: {
                enabled: true,
                format: '{point.id}',
                y: -20
            },
            marker: {
                radius: 8,
                lineWidth: 1,
                lineColor: '#fff',
                symbol: 'mapmarker'
            },
            data: [{
                id: 'Houston',
                lat: 29.75,
                lon: -95.36
            }, {
                id: 'Miami',
                lat: 25.76,
                lon: -80.19
            }, {
                id: 'Algeciras',
                lat: 36.17,
                lon: -5.35
            }, {
                id: 'Malta',
                lat: 35.92,
                lon: 14.41
            }, {
                id: 'Beirut',
                lat: 33.89,
                lon: 35.50
            }, {
                id: 'Jeddah',
                lat: 21.49,
                lon: 39.18
            }, {
                id: 'Singapore',
                lat: 1.29,
                lon: 103.85
            }, {
                id: 'Vung Tao',
                lat: 10.39,
                lon: 107.09
            }, {
                id: 'Hong Kong',
                lat: 22.39,
                lon: 114.11
            }]
        }, {
            zIndex: 1,
            type: 'flowmap',
            linkedTo: ':previous',
            accessibility: {
                description: 'This is a map showing the ship route.'
            },
            fillColor: Highcharts.getOptions().colors[0],
            color: '#000',
            name: 'Ship Routes',
            curveFactor: -0.4,
            markerEnd: {
                height: '42%',
                width: 0
            },
            data: [{
                from: 'Houston',
                to: 'Miami',
                weight: 5,
                curveFactor: -0.5
            }, {
                from: 'Miami',
                to: 'Algeciras',
                weight: 22,
                curveFactor: -0.15
            }, {
                from: 'Algeciras',
                to: 'Malta',
                weight: 2,
                curveFactor: 0.3
            }, {
                from: 'Malta',
                to: 'Beirut',
                weight: 4
            }, {
                from: 'Beirut',
                to: 'Jeddah',
                weight: 4
            }, {
                from: 'Jeddah',
                to: 'Singapore',
                weight: 10
            }, {
                from: 'Singapore',
                to: 'Vung Tao',
                weight: 3
            }, {
                from: 'Vung Tao',
                to: 'Hong Kong',
                weight: 3
            }]
        }]
    });
})();
