(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/world.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/world-population.json', function (data) {

        Highcharts.mapChart('container', {
            chart: {
                borderWidth: 1,
                map: topology
            },

            title: {
                text: 'World population 2016 by country'
            },

            subtitle: {
                text: 'Demo of Highcharts map with bubbles, mappoint and tiled web map series'
            },

            accessibility: {
                description: 'We see how China and India by far are the countries with the largest population.'
            },

            legend: {
                enabled: false
            },

            mapNavigation: {
                enabled: true,
                buttonOptions: {
                    verticalAlign: 'bottom'
                }
            },

            series: [{
                type: 'tiledwebmap',
                name: 'TWM Tiles',
                provider: {
                    type: 'Esri',
                    theme: 'NatGeoWorldMap'
                }
            }, {
                type: 'mappoint',
                name: 'Mappoints',
                enableMouseTracking: false,
                states: {
                    inactive: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: true
                },
                data: [{
                    name: 'London',
                    lat: 51.51,
                    lon: -0.13
                }, {
                    name: 'Vik i Sogn',
                    lat: 61.09,
                    lon: 6.58
                }, {
                    name: 'Krakow',
                    lon: 19.94,
                    lat: 50.06
                }, {
                    name: 'Kowloon',
                    lon: 114.18,
                    lat: 22.32
                }, {
                    name: 'Windhoek',
                    lat: -22.56,
                    lon: 17.06
                }, {
                    name: 'Doha',
                    lat: 25.29,
                    lon: 51.53
                }, {
                    name: 'Vancouver',
                    lat: 49.28,
                    lon: -123.12
                }]
            }, {
                type: 'mapline',
                color: 'black',
                name: 'Maplines',
                states: {
                    inactive: {
                        enabled: false
                    }
                },
                zIndex: 3,
                data: [{
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [-123.12, 49.28], // Vancouver
                            [-0.13, 51.51] // London
                        ]
                    },
                    color: '#ff8800'
                }, {
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [51.53, 25.29], // Doha
                            [114.18, 22.32] // Kowloon
                        ]
                    },
                    color: '#12b6ed'
                }
                ],
                lineWidth: 2,
                enableMouseTracking: false
            }, {
                type: 'mapbubble',
                name: 'Population 2016',
                joinBy: ['iso-a3', 'code3'],
                data: data,
                color: 'rgba(255, 0, 203, 0.5)',
                minSize: 4,
                maxSize: '12%',
                tooltip: {
                    pointFormat: '{point.properties.hc-a2}: {point.z} thousands'
                }
            }]
        });
    });

})();
