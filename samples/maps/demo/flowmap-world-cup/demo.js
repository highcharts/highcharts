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
                lat: 25.3548,
                lon: 51.1839,
                color: '#550d65'
            }, {
                id: 'Ecuador',
                lat: -2.2038,
                lon: -79.8974
            }, {
                id: 'Senegal',
                lat: 14.4974,
                lon: -14.4524
            }, {
                id: 'Netherlands',
                lat: 52.1326,
                lon: 5.2913
            }, {
                id: 'England',
                lat: 52.3555,
                lon: -1.1743
            }, {
                id: 'Iran',
                lat: 32.4279,
                lon: 53.6880
            }, {
                id: 'USA',
                lat: 39.7947,
                lon: -102.2567
            }, {
                id: 'Wales',
                lat: 52.3304,
                lon: -3.6992
            }, {
                id: 'Argentina',
                lat: -35.2151,
                lon: -65.1593
            }, {
                id: 'Saudi Arabia',
                lat: 24.0252,
                lon: 44.1760
            }, {
                id: 'Mexico',
                lat: 24.4281,
                lon: -102.3846
            }, {
                id: 'Poland',
                lat: 51.9114,
                lon: 19.4085
            }, {
                id: 'France',
                lat: 46.6269,
                lon: 2.3125
            }, {
                id: 'Australia',
                lat: -24.8287,
                lon: 133.7685
            }, {
                id: 'Denmark',
                lat: 55.9402,
                lon: 9.0500
            }, {
                id: 'Tunisia',
                lat: 34.1712,
                lon: 9.5809
            }, {
                id: 'Spain',
                lat: 39.6294,
                lon: -3.9216
            }, {
                id: 'Costa Rica',
                lat: 9.9378,
                lon: -84.0962
            }, {
                id: 'Germany',
                lat: 51.0535,
                lon: 10.2870
            }, {
                id: 'Japan',
                lat: 36.1354,
                lon: 138.5454
            }, {
                id: 'Belgium',
                lat: 50.7111,
                lon: 4.6716
            }, {
                id: 'Canada',
                lat: 60.3501,
                lon: -113.2265
            }, {
                id: 'Morocco',
                lat: 32.0442,
                lon: -6.2629
            }, {
                id: 'Croatia',
                lat: 45.0958,
                lon: 14.7933
            }, {
                id: 'Brazil',
                lat: -8.3563,
                lon: -56.1562
            }, {
                id: 'Serbia',
                lat: 44.0942,
                lon: 20.6894
            }, {
                id: 'Switzerland',
                lat: 46.7638,
                lon: 8.4819
            }, {
                id: 'Cameroon',
                lat: 5.6662,
                lon: 12.4790
            }, {
                id: 'Portugal',
                lat: 39.6098,
                lon: -8.1429
            }, {
                id: 'Ghana',
                lat: 7.9239,
                lon: -1.0211
            }, {
                id: 'Uruguay',
                lat: -32.8146,
                lon: -55.9933
            }, {
                id: 'South Korea',
                lat: 36.5201,
                lon: 127.8654
            }]
        }, {
            type: 'flowmap',
            name: 'Flowmap Series',
            fillOpacity: 0.2,
            weight: 0.2,
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
