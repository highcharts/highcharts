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
                text: 'World population 2013 by country'
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
                    lat: 51.507222,
                    lon: -0.1275
                }, {
                    name: 'Vik i Sogn',
                    lat: 61.087220,
                    lon: 6.579700
                }, {
                    name: 'Krakow',
                    lon: 19.944981,
                    lat: 50.064651
                }, {
                    name: 'Kowloon',
                    lon: 114.183,
                    lat: 22.317
                }, {
                    name: 'Windhoek',
                    lat: -22.55900,
                    lon: 17.06429
                }, {
                    name: 'Doha',
                    lat: 25.28547,
                    lon: 51.53037
                }, {
                    name: 'Vancouver',
                    lat: 49.28315,
                    lon: -123.12202
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
                            [-123.12202, 49.28315], // Vancouver
                            [-0.1275, 51.507222] // London
                        ]
                    },
                    color: '#ff8800'
                }, {
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [51.53037, 25.28547], // Doha
                            [114.183, 22.317] // Kowloon
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
