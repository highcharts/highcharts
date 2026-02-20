(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/contour-mountain-data.json'
    ).then(response => response.json());

    Highcharts.chart('container', {
        chart: {
            height: '80%',
            zooming: {
                type: 'xy'
            }
        },
        title: {
            text: 'Mountain topography'
        },
        subtitle: {
            text: 'With WebGPU contour series'
        },
        xAxis: {
            endOnTick: false,
            gridLineColor: '#fff4',
            gridLineWidth: 1,
            gridZIndex: 4,
            labels: {
                align: 'left',
                format: '{value:.2f}°E',
                style: {
                    fontSize: '0.6em'
                },
                y: -2
            },
            lineWidth: 0,
            maxPadding: 0,
            minPadding: 0,
            startOnTick: false,
            tickInterval: 0.01,
            tickWidth: 0
        },
        yAxis: {
            title: {
                text: ''
            },
            endOnTick: false,
            gridLineColor: '#fff4',
            gridLineWidth: 1,
            gridZIndex: 4,
            labels: {
                align: 'left',
                format: '{value:.2f}°N',
                style: {
                    fontSize: '0.6em'
                },
                x: 2,
                y: -3
            },
            maxPadding: 0,
            minPadding: 0,
            startOnTick: false,
            tickInterval: 0.01
        },
        colorAxis: {
            labels: {
                format: '{value} m'
            },
            stops: [
                [
                    0,
                    '#447cff'
                ],
                [
                    0.5,
                    '#f5ff66'
                ],
                [
                    0.9,
                    '#ff5e4f'
                ]
            ]
        },
        legend: {
            title: {
                text: 'Elevation'
            },
            align: 'right',
            layout: 'vertical',
            verticalAlign: 'middle'
        },
        responsive: {
            rules: [{
                chartOptions: {
                    chart: {
                        height: '130%'
                    },
                    colorAxis: {
                        labels: {
                            format: '{value}'
                        }
                    },
                    legend: {
                        align: 'center',
                        layout: 'horizontal',
                        verticalAlign: 'bottom'
                    }
                },
                condition: {
                    maxWidth: 500
                }
            }]
        },
        series: [{
            clip: true,
            contourInterval: 50,
            contourOffset: 0,
            data: data,
            lineColor: '#888',
            lineWidth: 1,
            marker: {
                states: {
                    hover: {
                        lineColor: 'white',
                        lineWidth: 2
                    }
                }
            },
            name: 'Elevation',
            smoothColoring: false,
            states: {
                hover: {
                    opacity: 1
                }
            },
            type: 'contour'
        }, {
            colorAxis: false,
            data: [
                [
                    22.7688,
                    49.072,
                    1333,
                    'Halicz'
                ],
                [
                    22.7702,
                    49.062,
                    1280,
                    'Rozsypaniec'
                ]
            ],
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b><br>{point.value} m',
                style: {
                    fontWeight: 'normal'
                }
            },
            keys: ['x', 'y', 'value', 'name'],
            marker: {
                fillColor: '#000',
                symbol: 'triangle'
            },
            name: 'Peaks',
            showInLegend: false,
            type: 'scatter'
        }],
        tooltip: {
            pointFormat: `
                Latitude: <strong>{point.x:.2f} ºE</strong>,<br/>
                Longitude: <strong>{point.y:.2f} ºN</strong>,<br/>
                Elevation: <strong>{point.value} m</strong>
            `
        }
    });

})();
