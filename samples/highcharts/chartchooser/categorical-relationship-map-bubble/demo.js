const dirDist50 = '#E8544E',
    dirDist10 = '#FFD265',
    dirDistLess10 = '#2AA775';


(async () => {

    const topology = await fetch(
        'https://code.highcharts.com/mapdata/countries/kr/kr-all.topo.json'
    ).then(response => response.json());


    // Initialize the chart
    const chart = Highcharts.mapChart('container', {
        title: {
            text: 'South Korea domestic flight routes'
        },

        xAxis: { visible: false },
        yAxis: { visible: false },
        legend: {
            align: 'right',
            layout: 'vertical',
            x: -50,
            floating: true,
            bubbleLegend: {
                enabled: true,
                labels: {
                    format: '{value:f}'
                },
                borderWidth: 1,
                borderColor: 'black',
                connectorColor: 'black',
                connectorDistance: 40,
                maxSize: 15 * 2,
                minSize: 5 * 2,
                ranges: [
                    {
                        value: 5,
                        name: '>10',
                        color: 'green'
                    },
                    {
                        value: 10,
                        color: 'yellow'
                    },
                    {
                        value: 50,
                        color: 'red'
                    }
                ]
            }
        },

        mapNavigation: {
            enabled: true
        },

        tooltip: {
            useHTML: true,
            headerFormat: '',
            pointFormat: '<b>{point.id}</b>'
        },

        plotOptions: {
            series: {
                marker: {
                    fillColor: '#FFFFFF',
                    lineWidth: 2,
                    lineColor: Highcharts.getOptions().colors[1]
                }
            }
        },

        series: [
            {
                // Use the gb-all map with no data as a basemap
                mapData: topology,
                name: 'Basemap',
                borderColor: '#707070',
                nullColor: 'rgba(200, 200, 200, 0.3)',
                showInLegend: false
            },
            {
                // Specify cities using lat/lon
                type: 'mappoint',
                name: 'Airport',
                dataLabels: {
                    format: '{point.id}'
                },
                // Use id instead of name to allow for referencing points later using
                // chart.get
                data: [
                    {
                        id: 'Seoul ICN',
                        lat: 37.4602,
                        lon: 126.4407,
                        marker: {
                            lineWidth: 0,
                            radius: 15,
                            fillColor: dirDist50
                        }
                    },
                    {
                        id: 'Busan',
                        lat: 35.166668,
                        lon: 129.066666,
                        marker: {
                            lineWidth: 0,
                            radius: 15,
                            fillColor: dirDist50
                        }
                    },
                    {
                        id: 'Jeju',
                        lat: 33.4996,
                        lon: 126.5312,
                        marker: {
                            lineWidth: 0,
                            radius: 15,
                            fillColor: dirDist50
                        }
                    },
                    {
                        id: 'Wonju',
                        lat: 37.3422,
                        lon: 127.9202,
                        marker: {
                            lineWidth: 0,
                            radius: 5,
                            fillColor: dirDistLess10
                        }
                    },
                    {
                        id: 'Daegu',
                        lat: 35.8714,
                        lon: 128.6014,
                        marker: {
                            lineWidth: 0,
                            radius: 5,
                            fillColor: dirDistLess10
                        }
                    },
                    {
                        id: 'Yangyang',
                        lat: 38.0754,
                        lon: 128.6189,
                        marker: {
                            lineWidth: 0,
                            radius: 5,
                            fillColor: dirDistLess10
                        }
                    },
                    {
                        id: 'Gunsan',
                        lat: 35.9677,
                        lon: 126.7366,
                        marker: {
                            lineWidth: 0,
                            radius: 5,
                            fillColor: dirDistLess10
                        }
                    },
                    {
                        id: 'Gwangju',
                        lat: 35.1595,
                        lon: 126.8526,
                        marker: {
                            lineWidth: 0,
                            radius: 5,
                            fillColor: dirDistLess10
                        }
                    },
                    {
                        id: 'Pohang',
                        lat: 36.019,
                        lon: 129.3435,
                        marker: {
                            lineWidth: 0,
                            radius: 10,
                            fillColor: dirDist10
                        }
                    },
                    {
                        id: 'Cheongju',
                        lat: 36.6424,
                        lon: 127.489,
                        marker: {
                            lineWidth: 0,
                            radius: 10,
                            fillColor: dirDist10
                        }
                    },
                    {
                        id: 'Seoul GMP',
                        lat: 37.5587,
                        lon: 126.7945,
                        marker: {
                            lineWidth: 0,
                            radius: 10,
                            fillColor: dirDist10
                        }
                    },
                    {
                        id: 'Ulsan',
                        lat: 35.5384,
                        lon: 129.3114,
                        marker: {
                            lineWidth: 0,
                            radius: 5,
                            fillColor: dirDistLess10
                        }
                    },
                    {
                        id: 'Yeosu',
                        lat: 34.7604,
                        lon: 127.6622,
                        marker: {
                            lineWidth: 0,
                            radius: 5,
                            fillColor: dirDistLess10
                        }
                    },
                    {
                        id: 'Sacheon',
                        lat: 35.0038,
                        lon: 128.0642,
                        marker: {
                            lineWidth: 0,
                            radius: 5,
                            fillColor: dirDistLess10
                        }
                    }
                ]
            },
            {
                type: 'bubble',
                showInLegend: false,
                data: [
                    {
                        z: 5
                    },
                    {
                        z: 10
                    },
                    {
                        z: 15
                    }
                ]
            }
        ]
    });

    function pointsToPath(fromPoint, toPoint, invertArc) {
        const
            from = chart.mapView.lonLatToProjectedUnits(fromPoint),
            to = chart.mapView.lonLatToProjectedUnits(toPoint),
            curve = 0.05,
            arcPointX = (from.x + to.x) / (invertArc ? 2 + curve : 2 - curve),
            arcPointY = (from.y + to.y) / (invertArc ? 2 + curve : 2 - curve);
        return [
            ['M', from.x, from.y],
            ['Q', arcPointX, arcPointY, to.x, to.y]
        ];
    }

    const seoulICNPoint = chart.get('Seoul ICN'),
        seoulGMPPoint = chart.get('Seoul GMP'),
        busanPoint = chart.get('Busan'),
        jejuPoint = chart.get('Jeju');

    // Add a series of lines for Seoul
    chart.addSeries({
        name: 'Seoul flight routes',
        type: 'mapline',
        dashStyle: 'Dot',
        lineWidth: 2,
        color: Highcharts.getOptions().colors[4],
        data: [
            {
                id: 'Seoul - Daegu',
                path: pointsToPath(seoulICNPoint, chart.get('Daegu'))
            },
            {
                id: 'Seoul - Busan',
                path: pointsToPath(seoulICNPoint, chart.get('Busan'), true)
            }
        ]
    });
    // Add a series of lines for Seoul GMP
    chart.addSeries({
        name: 'Seoul GMP flight routes',
        type: 'mapline',
        dashStyle: 'ShortDot',
        lineWidth: 2,
        color: Highcharts.getOptions().colors[1],
        data: [
            {
                id: 'Seoul - Daegu',
                path: pointsToPath(seoulGMPPoint, chart.get('Daegu'))
            },
            {
                id: 'Seoul - Busan',
                path: pointsToPath(seoulGMPPoint, chart.get('Busan'), true)
            },
            {
                id: 'Seoul - Pohang',
                path: pointsToPath(seoulGMPPoint, chart.get('Pohang'), true)
            },
            {
                id: 'Seoul - Gwangju',
                path: pointsToPath(seoulGMPPoint, chart.get('Gwangju'), true)
            },
            {
                id: 'Seoul - Yeosu',
                path: pointsToPath(seoulGMPPoint, chart.get('Yeosu'), true)
            },
            {
                id: 'Seoul - Sacheon',
                path: pointsToPath(seoulGMPPoint, chart.get('Sacheon'), true)
            },
            {
                id: 'Seoul - Ulsan',
                path: pointsToPath(seoulGMPPoint, chart.get('Ulsan'), true)
            }
        ]
    });
    // Add a series of lines for Busan
    chart.addSeries({
        name: 'Busan flight routes',
        type: 'mapline',
        dashStyle: 'dash',
        lineWidth: 2,
        color: Highcharts.getOptions().colors[4],
        data: [
            {
                id: 'Busan - Jeju',
                path: pointsToPath(busanPoint, chart.get('Jeju'))
            },
            {
                id: 'Busan - Yangyang',
                path: pointsToPath(busanPoint, chart.get('Yangyang'), true)
            }
        ]
    });
    // Add a series of lines for Jeju
    chart.addSeries({
        name: 'Jeju flight routes',
        type: 'mapline',
        dashStyle: 'solid',
        lineWidth: 2,
        color: Highcharts.getOptions().colors[4],
        data: [
            {
                id: 'Jeju - Gwangju',
                path: pointsToPath(jejuPoint, chart.get('Gwangju'))
            },
            {
                id: 'Jeju - Gunsan',
                path: pointsToPath(jejuPoint, chart.get('Gunsan'), true)
            },
            {
                id: 'Jeju - Wonju',
                path: pointsToPath(jejuPoint, chart.get('Wonju'), true)
            },
            {
                id: 'Jeju - Yangyang',
                path: pointsToPath(jejuPoint, chart.get('Yangyang'), true)
            },
            {
                id: 'Jeju - Daegu',
                path: pointsToPath(jejuPoint, chart.get('Daegu'), true)
            },
            {
                id: 'Jeju - Yeosu',
                path: pointsToPath(jejuPoint, chart.get('Yeosu'), true)
            },
            {
                id: 'Jeju - Sacheon',
                path: pointsToPath(jejuPoint, chart.get('Sacheon'), true)
            },
            {
                id: 'Jeju - Ulsan',
                path: pointsToPath(jejuPoint, chart.get('Ulsan'), true)
            },
            {
                id: 'Jeju - Cheongju',
                path: pointsToPath(jejuPoint, chart.get('Cheongju'), true)
            }
        ]
    });
})();