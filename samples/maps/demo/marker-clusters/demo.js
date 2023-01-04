(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/custom/europe.topo.json'
    ).then(response => response.json());

    Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts@1e9e659c2d60fbe27ef0b41e2f93112dd68fb7a3/samples/data/european-train-stations-near-airports.json', function (data) {
        Highcharts.mapChart('container', {
            chart: {
                map: topology
            },
            title: {
                text: 'European Train Stations Near Airports',
                align: 'left'
            },
            subtitle: {
                text: 'Source: <a href="https://github.com/trainline-eu/stations">' +
                    'github.com/trainline-eu/stations</a>',
                align: 'left'
            },
            mapNavigation: {
                enabled: true
            },
            tooltip: {
                headerFormat: '',
                pointFormat: '<b>{point.name}</b><br>Lat: {point.lat:.2f}, Lon: {point.lon:.2f}'
            },
            colorAxis: {
                min: 0,
                max: 20
            },
            plotOptions: {
                mappoint: {
                    cluster: {
                        enabled: true,
                        allowOverlap: false,
                        animation: {
                            duration: 450
                        },
                        layoutAlgorithm: {
                            type: 'grid',
                            gridSize: 70
                        },
                        zones: [{
                            from: 1,
                            to: 4,
                            marker: {
                                radius: 13
                            }
                        }, {
                            from: 5,
                            to: 9,
                            marker: {
                                radius: 15
                            }
                        }, {
                            from: 10,
                            to: 15,
                            marker: {
                                radius: 17
                            }
                        }, {
                            from: 16,
                            to: 20,
                            marker: {
                                radius: 19
                            }
                        }, {
                            from: 21,
                            to: 100,
                            marker: {
                                radius: 21
                            }
                        }]
                    }
                }
            },
            series: [{
                name: 'Europe',
                accessibility: {
                    exposeAsGroupOnly: true
                },
                borderColor: '#A0A0A0',
                nullColor: 'rgba(177, 244, 177, 0.5)',
                showInLegend: false
            }, {
                type: 'mappoint',
                enableMouseTracking: true,
                accessibility: {
                    point: {
                        descriptionFormatter: function (point) {
                            if (point.isCluster) {
                                return 'Grouping of ' + point.clusterPointsAmount + ' points.';
                            }
                            return point.name + ', country code: ' + point.country + '.';
                        }
                    }
                },
                colorKey: 'clusterPointsAmount',
                name: 'Cities',
                data: data,
                color: Highcharts.getOptions().colors[5],
                marker: {
                    lineWidth: 1,
                    lineColor: '#fff',
                    symbol: 'mapmarker',
                    radius: 8
                },
                dataLabels: {
                    verticalAlign: 'top'
                }
            }]
        });
    });

})();
