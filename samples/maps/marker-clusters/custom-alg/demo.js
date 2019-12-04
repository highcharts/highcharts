Highcharts.mapChart('container', {
    chart: {
        map: 'countries/gb/gb-all',
        animation: true
    },
    title: {
        text: 'Marker clusters custom algorithm'
    },
    mapNavigation: {
        enabled: true
    },
    tooltip: {
        headerFormat: '',
        pointFormat: '<b>{point.name}</b><br>Lat: {point.lat}, Lon: {point.lon}'
    },
    plotOptions: {
        mappoint: {
            cluster: {
                enabled: true,
                minimumClusterSize: 2,
                layoutAlgorithm: {
                    gridSize: 50,
                    type: function (
                        dataX,
                        dataY,
                        dataIndexes,
                        options
                    ) {
                        var series = this,
                            xAxis = series.xAxis,
                            yAxis = series.yAxis,
                            grid = {},
                            gridOffset = series.getGridOffset(),
                            scaledGridSize, x, y, gridX, gridY, key, i;

                        scaledGridSize = series.getScaledGridSize(options);

                        for (i = 0; i < dataX.length; i++) {
                            x = xAxis.toPixels(dataX[i]) - gridOffset.plotLeft;
                            y = yAxis.toPixels(dataY[i]) - gridOffset.plotTop;
                            gridX = Math.floor(x / scaledGridSize);
                            gridY = Math.floor(y / scaledGridSize);
                            key = gridY + '-' + gridX;

                            if (!grid[key]) {
                                grid[key] = [];
                            }

                            grid[key].push({
                                dataIndex: dataIndexes[i],
                                x: dataX[i],
                                y: dataY[i]
                            });
                        }

                        return grid;
                    }
                },
                marker: {
                    lineColor: 'rgba(0, 0, 0, 0.1)'
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.clusterPointsAmount}',
                    marker: {
                        fontSize: '9px'
                    }
                },
                zones: [{
                    from: 1,
                    to: 2,
                    marker: {
                        fillColor: '#99D18E',
                        radius: 13
                    }
                }, {
                    from: 3,
                    to: 4,
                    marker: {
                        fillColor: '#5AAC44',
                        radius: 15
                    }
                }, {
                    from: 5,
                    to: 10,
                    marker: {
                        fillColor: '#49852E',
                        radius: 17
                    }
                }]
            }
        }
    },
    series: [{
        name: 'Basemap',
        borderColor: '#A0A0A0',
        nullColor: 'rgba(252, 233, 179, 0.2)',
        showInLegend: false
    }, {
        type: 'mappoint',
        name: 'Cities',
        color: Highcharts.getOptions().colors[1],
        data: [{
            name: "York",
            lat: 53.958332,
            lon: -1.080278
        }, {
            name: "Worcester",
            lat: 52.192001,
            lon: -2.22
        }, {
            name: "Winchester",
            lat: 51.063202,
            lon: -1.308
        }, {
            name: "Wells",
            lat: 51.209,
            lon: -2.647
        }, {
            name: "Wakefield",
            lat: 53.68,
            lon: -1.49
        }, {
            name: "Truro",
            lat: 50.259998,
            lon: -5.051
        }, {
            name: "Sunderland",
            lat: 54.906101,
            lon: -1.38113
        }, {
            name: "Sheffield",
            lat: 53.383331,
            lon: -1.466667
        }, {
            name: "Salford",
            lat: 53.483002,
            lon: -2.2931
        }, {
            name: "St.Davids",
            lat: 51.882,
            lon: -5.269
        }, {
            name: "St.Albans",
            lat: 51.755001,
            lon: -0.336
        }, {
            name: "Ripon",
            lat: 54.138,
            lon: -1.524
        }, {
            name: "Portsmouth",
            lat: 50.805832,
            lon: -1.087222
        }, {
            name: "Perth",
            lat: 56.396999,
            lon: -3.437
        }, {
            name: "Nottingham",
            lat: 52.950001,
            lon: -1.15
        }, {
            name: "Newry",
            lat: 54.175999,
            lon: -6.349
        }, {
            name: "Newcastle",
            lat: 54.966667,
            lon: -1.6
        }, {
            name: "Liverpool",
            lat: 53.400002,
            lon: -2.983333
        }, {
            name: "Lincoln",
            lat: 53.234444,
            lon: -0.538611
        }, {
            name: "Lichfield",
            lat: 52.683498,
            lon: -1.82653
        }, {
            name: "Leicester",
            lat: 52.633331,
            lon: -1.133333
        }, {
            name: "Lancaster",
            lat: 54.047001,
            lon: -2.801
        }, {
            name: "Hereford",
            lat: 52.056499,
            lon: -2.716
        }, {
            name: "Gloucester",
            lat: 51.864445,
            lon: -2.244444
        }, {
            name: "Glasgow",
            lat: 55.860916,
            lon: -4.251433
        }, {
            name: "Exeter",
            lat: 50.716667,
            lon: -3.533333
        }, {
            name: "Ely",
            lat: 52.398056,
            lon: 0.262222
        }, {
            name: "Durham",
            lat: 54.7761,
            lon: -1.5733
        }, {
            name: "Dundee",
            lat: 56.462002,
            lon: -2.9707
        }, {
            name: "Derry",
            lat: 54.9958,
            lon: -7.3074
        }, {
            name: "Derby",
            lat: 52.916668,
            lon: -1.466667
        }, {
            name: "Coventry",
            lat: 52.408054,
            lon: -1.510556
        }, {
            name: "Chichester",
            lat: 50.836498,
            lon: -0.7792
        }, {
            name: "Chester",
            lat: 53.189999,
            lon: -2.89
        }, {
            name: "Chelmsford",
            lat: 51.736099,
            lon: 0.4798
        }, {
            name: "Carlisle",
            lat: 54.890999,
            lon: -2.944
        }, {
            name: "Canterbury",
            lat: 51.279999,
            lon: 1.08
        }, {
            name: "Cambridge",
            lat: 52.205276,
            lon: 0.119167
        }, {
            name: "Brighton &amp; Hove",
            lat: 50.827778,
            lon: -0.152778
        }, {
            name: "Bradford",
            lat: 53.799999,
            lon: -1.75
        }, {
            name: "Bath",
            lat: 51.380001,
            lon: -2.36
        }, {
            name: "Peterborough",
            lat: 52.573921,
            lon: -0.25083
        }, {
            name: "Elgin",
            lat: 57.653484,
            lon: -3.335724
        }, {
            name: "Stoke-on-Trent",
            lat: 53.002666,
            lon: -2.179404
        }, {
            name: "Solihull",
            lat: 52.412811,
            lon: -1.778197
        }, {
            name: "Cardiff",
            lat: 51.481583,
            lon: -3.17909
        }, {
            name: "Eastbourne",
            lat: 50.768036,
            lon: 0.290472
        }, {
            name: "Oxford",
            lat: 51.752022,
            lon: -1.257677
        }, {
            name: "London",
            lat: 51.509865,
            lon: -0.118092
        }, {
            name: "Swindon",
            lat: 51.568535,
            lon: -1.772232
        }]
    }]
});
