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
    chartOptionsExtra:{
        chart: {
            height: 500,
            zooming: {
                type: 'xy'
            }
        },
        title: {
            text: 'Mountain elevation'
        },
        xAxis: {
            tickInterval: 0.01,
            gridLineWidth: 1,
            title: {
                text: 'longitude'
            },
            gridLineColor: '#fff4',
            gridZIndex: 4,
            minPadding: 0,
            maxPadding: 0,
            endOnTick: false,
            startOnTick: false,
            tickWidth: 1,
            lineWidth: 1
        },
        yAxis: {
            tickInterval: 0.01,
            gridLineWidth: 1,
            title: {
                text: 'latitude'
            },
            gridLineColor: '#fff4',
            gridZIndex: 4,
            minPadding: 0,
            maxPadding: 0,
            endOnTick: false,
            startOnTick: false,
            tickWidth: 1,
            lineWidth: 1
        },
        colorAxis: {
            stops: [
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a']
            ]
        },
        tooltip: {
            pointFormat: `
                lat: <strong>{point.x:.2f}</strong>,<br/>
                lon: <strong>{point.y:.2f}</strong>,<br/>
                elevation: <strong>{point.value} m</strong>
            `
        },
        series: [{
            contourInterval: 50,
            clip: true,
            type: 'contour',
            name: 'Elevation',
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
                format: '{point.name}'
            },
            marker: {
                symbol: 'triangle',
                fillColor: '#000'
            }
        }]
    }
} satisfies SampleGeneratorConfig;