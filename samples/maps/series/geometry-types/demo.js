Highcharts.getJSON(
    'https://code.highcharts.com/mapdata/custom/world.topo.json',
    topology => {
        Highcharts.mapChart('container', {
            title: {
                text: 'Geometry types'
            },

            subtitle: {
                text: 'Simplified use cases'
            },

            tooltip: {
                pointFormat: '{point.name}'
            },

            mapView: {
                projection: {
                    name: 'Miller'
                }
            },

            series: [{
                name: 'World map',
                type: 'map',
                mapData: topology,
                showInLegend: false
            }, {
                name: 'Point',
                type: 'mappoint',
                color: Highcharts.defaultOptions.colors[0],
                data: [{
                    name: 'London',
                    geometry: {
                        type: 'Point',
                        coordinates: [0, 51]
                    }
                }, {
                    name: 'Calgary',
                    geometry: {
                        type: 'Point',
                        coordinates: [-114, 51]
                    }
                }],
                enableMouseTracking: false
            }, {
                name: 'LineString',
                type: 'mapline',
                color: Highcharts.defaultOptions.colors[0],
                data: [{
                    name: 'Flight Route (Calgary - London)',
                    geometry: {
                        type: 'LineString',
                        coordinates: [
                            [0, 51],
                            [-114, 51]
                        ]
                    }
                }]
            }, {
                name: 'MultiLineString',
                type: 'mapline',
                data: [{
                    name: 'Longtitudes (West and East Australia)',
                    geometry: {
                        type: 'MultiLineString',
                        coordinates: [
                            [
                                [113, 80],
                                [113, -55]
                            ],
                            [
                                [153, 80],
                                [153, -55]
                            ]
                        ]
                    }
                }]
            }, {
                name: 'Polygon',
                type: 'map',
                data: [{
                    name: 'Amazon Rainforest Area',
                    geometry: {
                        type: 'Polygon',
                        coordinates: [
                            [
                                [-79, -1],
                                [-77, -11],
                                [-63, -20],
                                [-56, -14],
                                [-45, -3],
                                [-63, 9]
                            ]
                        ]
                    }
                }]
            }, {
                name: 'MultiPolygon',
                type: 'map',
                data: [{
                    name: 'African Deserts Area',
                    geometry: {
                        type: 'MultiPolygon',
                        coordinates: [
                            [
                                [
                                    [-16, 14],
                                    [27, 10],
                                    [39, 15],
                                    [31, 30],
                                    [21, 32],
                                    [18, 29],
                                    [8, 36],
                                    [-9, 30],
                                    [-15, 23]
                                ]
                            ],
                            [
                                [
                                    [19, -32],
                                    [26, -32],
                                    [28, -21],
                                    [13, -17]
                                ]
                            ]
                        ]
                    }
                }]
            }]
        });
    }
);