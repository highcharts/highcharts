import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'colorAxis.marker.color',
        value: '#ffffff01'
    }, {
        path: 'colorAxis.marker.lineColor',
        value: '#ffffff'
    }, {
        path: 'colorAxis.marker.lineWidth',
        value: 3
    }, {
        path: 'colorAxis.marker.symbol',
        value: 'circle',
        options: ['circle', 'square', 'diamond']
    }],
    modules: ['highcharts-more', 'modules/coloraxis'],
    templates: [],
    chartOptionsExtra: {
        chart: {
            type: 'bubble'
        },
        colorAxis: {},
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },
        series: [{
            keys: ['x', 'y', 'z', 'colorValue'],
            data: [
                [9, 81, 63, 3],
                [98, 5, 89, 1],
                [51, 50, 73, 5],
                [41, 22, 14, 6],
                [58, 24, 20, 2],
                [78, 37, 34, 7],
                [55, 56, 53, 2],
                [18, 45, 70, 99],
                [42, 44, 28, 2],
                [3, 52, 59, 42],
                [31, 18, 97, 1],
                [79, 91, 63, 0],
                [93, 23, 23, 4],
                [44, 83, 22, 2]
            ]
        }]
    }
} satisfies SampleGeneratorConfig;