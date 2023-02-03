(async () => {
    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.mapChart('container', {
        chart: {
            map: topology
        },

        title: {
            text: '2022 World Cup teams flights to Qatar',
            align: 'left'
        },

        mapNavigation: {
            enabled: true
        },

        mapView: {
            fitToGeometry: {
                type: 'MultiPoint',
                coordinates: [
                    // Alaska west
                    [-164, 54],
                    // Greenland north
                    [-35, 84],
                    // New Zealand east
                    [179, -38],
                    // Chile south
                    [-68, -55]
                ]
            }
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
                        {point.options.to}`
                }
            },
            mappoint: {
                tooltip: {
                    headerFormat: '{point.point.id}<br>',
                    pointFormat: 'Lat: {point.lat} Lon: {point.lon}'
                },
                showInLegend: false
            }
        },

        series: [{
            name: 'Basemap',
            showInLegend: false,
            states: {
                inactive: {
                    enabled: false
                }
            },
            data: [
                ['qa', 1]
            ]
        }, {
            type: 'mappoint',
            name: 'Countries',
            color: '#add8e6',
            dataLabels: {
                format: '{point.id}'
            },
            data: [{
                id: 'Qatar',
                lat: 25.35,
                lon: 51.18,
                color: '#550d65'
            }, {
                id: 'Ecuador',
                lat: -2.20,
                lon: -79.9
            }, {
                id: 'Senegal',
                lat: 14.5,
                lon: -14.5
            }, {
                id: 'Netherlands',
                lat: 52.13,
                lon: 5.29
            }, {
                id: 'England',
                lat: 52.36,
                lon: -1.17
            }, {
                id: 'Iran',
                lat: 32.43,
                lon: 53.69
            }, {
                id: 'USA',
                lat: 39.79,
                lon: -102.26
            }, {
                id: 'Wales',
                lat: 52.33,
                lon: -3.7
            }, {
                id: 'Argentina',
                lat: -35.21,
                lon: -65.16
            }, {
                id: 'Saudi Arabia',
                lat: 24.03,
                lon: 44.18
            }, {
                id: 'Mexico',
                lat: 24.43,
                lon: -102.38
            }, {
                id: 'Poland',
                lat: 51.91,
                lon: 19.41
            }, {
                id: 'France',
                lat: 46.63,
                lon: 2.31
            }, {
                id: 'Australia',
                lat: -24.83,
                lon: 133.77
            }, {
                id: 'Denmark',
                lat: 55.94,
                lon: 9.05
            }, {
                id: 'Tunisia',
                lat: 34.17,
                lon: 9.58
            }, {
                id: 'Spain',
                lat: 39.63,
                lon: -3.92
            }, {
                id: 'Costa Rica',
                lat: 9.94,
                lon: -84.1
            }, {
                id: 'Germany',
                lat: 51.05,
                lon: 10.29
            }, {
                id: 'Japan',
                lat: 36.14,
                lon: 138.55
            }, {
                id: 'Belgium',
                lat: 50.71,
                lon: 4.67
            }, {
                id: 'Canada',
                lat: 60.35,
                lon: -113.23
            }, {
                id: 'Morocco',
                lat: 32.04,
                lon: -6.26
            }, {
                id: 'Croatia',
                lat: 45.1,
                lon: 14.79
            }, {
                id: 'Brazil',
                lat: -8.36,
                lon: -56.16
            }, {
                id: 'Serbia',
                lat: 44.09,
                lon: 20.69
            }, {
                id: 'Switzerland',
                lat: 46.76,
                lon: 8.48
            }, {
                id: 'Cameroon',
                lat: 5.67,
                lon: 12.48
            }, {
                id: 'Portugal',
                lat: 39.61,
                lon: -8.14
            }, {
                id: 'Ghana',
                lat: 7.92,
                lon: -1.02
            }, {
                id: 'Uruguay',
                lat: -32.81,
                lon: -55.99
            }, {
                id: 'South Korea',
                lat: 36.52,
                lon: 127.87
            }]
        }, {
            type: 'flowmap',
            name: 'Flowmap Series',
            accessibility: {
                point: {
                    valueDescriptionFormat:
                        'Origin: {point.options.from:.2f}, ' +
                            'Destination: {point.options.to:.2f}.'
                },
                description:
                    'This is a map showing flight routes to Qatar ' +
                        'from countries that participated in the 2022 World Cup.'
            },
            fillOpacity: 1,
            width: 0.2,
            color: '#550d6566',
            data: [
                ['Ecuador', 'Qatar'],
                ['Senegal', 'Qatar'],
                ['Netherlands', 'Qatar'],
                ['England', 'Qatar'],
                ['Iran', 'Qatar'],
                ['USA', 'Qatar'],
                ['Wales', 'Qatar'],
                ['Argentina', 'Qatar'],
                ['Saudi Arabia', 'Qatar'],
                ['Mexico', 'Qatar'],
                ['Poland', 'Qatar'],
                ['France', 'Qatar'],
                ['Australia', 'Qatar'],
                ['Denmark', 'Qatar'],
                ['Tunisia', 'Qatar'],
                ['Spain', 'Qatar'],
                ['Costa Rica', 'Qatar'],
                ['Germany', 'Qatar'],
                ['Japan', 'Qatar'],
                ['Belgium', 'Qatar'],
                ['Canada', 'Qatar'],
                ['Morocco', 'Qatar'],
                ['Croatia', 'Qatar'],
                ['Brazil', 'Qatar'],
                ['Serbia', 'Qatar'],
                ['Switzerland', 'Qatar'],
                ['Cameroon', 'Qatar'],
                ['Portugal', 'Qatar'],
                ['Ghana', 'Qatar'],
                ['Uruguay', 'Qatar'],
                ['South Korea', 'Qatar']
            ]
        }]
    });
})();
