import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'pane.size',
        value: '85%'
    }],
    modules: ['highcharts-more'],
    templates: [],
    chartOptionsExtra: {
        chart: {
            type: 'gauge',
            plotBorderWidth: 1
        },
        pane: {
            size: '85%',
            startAngle: 0,
            endAngle: 360
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