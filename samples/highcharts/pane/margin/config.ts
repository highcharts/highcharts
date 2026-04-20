import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'pane.margin',
        value: 30
    }],
    modules: ['highcharts-more'],
    templates: [],
    chartOptionsExtra: {
        chart: {
            type: 'gauge',
            plotBorderWidth: 1
        },
        pane: {
            margin: 30
        },
        yAxis: {
            min: 0,
            max: 100,
            plotBands: [{
                from: 50,
                to: 70,
                color: '#ffbf00'
            }, {
                from: 70,
                to: 100,
                color: '#00a96b'
            }]
        },
        series: [{
            data: [80]
        }]
    }
} satisfies SampleGeneratorConfig;