import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'pane.size'
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
            max: 100
        },
        series: [{
            data: [80]
        }]
    }
} satisfies SampleGeneratorConfig;