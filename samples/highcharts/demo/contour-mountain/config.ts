import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'series[0].smoothColoring',
        value: false
    }, {
        path: 'series[0].lineWidth',
        value: 1,
        min: 0,
        max: 2,
        step: 1
    }, {
        path: 'series[0].contourInterval',
        value: 50,
        min: 0,
        max: 100,
        step: 1
    }, {
        path: 'series[0].contourOffset',
        value: 0,
        min: 0,
        max: 50,
        step: 1
    }],
    modules: ['modules/contour'],
    dataFile: 'contour-mountain-data.json',
    templates: [],
    factory: 'chart',
    details: {
        name: 'Mountain elevation with contour series',
        authors: ['Dawid Dragula', 'Markus Knutson Barstad'],
        tags: ['Highcharts demo'],
        categories: [{
            key: 'Heat and tree maps',
            priority: 1
        }]
    },
    chartOptionsExtra: {
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
            tickInterval: 0.01,
            gridLineWidth: 1,
            labels: {
                align: 'left',
                format: '{value:.2f}°E',
                style: {
                    fontSize: '0.6em'
                },
                y: -2
            },
            gridLineColor: '#fff4',
            gridZIndex: 4,
            minPadding: 0,
            maxPadding: 0,
            endOnTick: false,
            startOnTick: false,
            tickWidth: 0,
            lineWidth: 0
        },
        yAxis: {
            tickInterval: 0.01,
            gridLineWidth: 1,
            labels: {
                align: 'left',
                format: '{value:.2f}°N',
                style: {
                    fontSize: '0.6em'
                },
                x: 2,
                y: -3
            },
            title: {
                text: ''
            },
            gridLineColor: '#fff4',
            gridZIndex: 4,
            minPadding: 0,
            maxPadding: 0,
            endOnTick: false,
            startOnTick: false
        },
        legend: {
            title: {
                text: 'Elevation'
            },
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical'
        },
        colorAxis: {
            labels: {
                format: '{value} m'
            },
            stops: [
                [0, '#447cff'],
                [0.5, '#f5ff66'],
                [0.9, '#ff5e4f']
            ]
        },
        tooltip: {
            pointFormat: `
                Latitude: <strong>{point.x:.2f} ºE</strong>,<br/>
                Longitude: <strong>{point.y:.2f} ºN</strong>,<br/>
                Elevation: <strong>{point.value} m</strong>
            `
        },
        series: [{
            clip: true,
            type: 'contour',
            name: 'Elevation',
            lineColor: '#888',
            marker: {
                states: {
                    hover: {
                        lineColor: 'white',
                        lineWidth: 2
                    }
                }
            },
            states: {
                hover: {
                    opacity: 1
                }
            }
        }, {
            type: 'scatter',
            name: 'Peaks',
            keys: ['x', 'y', 'value', 'name'],
            colorAxis: false,
            showInLegend: false,
            data: [
                [22.7688, 49.072, 1333, 'Halicz'],
                [22.7702, 49.062, 1280, 'Rozsypaniec']
            ],
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b><br>{point.value} m',
                style: {
                    fontWeight: 'normal'
                }
            },
            marker: {
                symbol: 'triangle',
                fillColor: '#000'
            }
        }],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    chart: {
                        height: '130%'
                    },
                    legend: {
                        align: 'center',
                        verticalAlign: 'bottom',
                        layout: 'horizontal'
                    },
                    colorAxis: {
                        labels: {
                            format: '{value}'
                        }
                    }
                }
            }]
        }
    }
} satisfies SampleGeneratorConfig;