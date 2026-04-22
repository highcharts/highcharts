import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'pane.size',
        value: '85%'
    }, {
        path: 'pane.innerSize',
        value: '90%'
    }],
    modules: ['highcharts-more'],
    templates: ['gauge'],
    chartOptionsExtra: {
        chart: {
            plotBorderWidth: 1
        },
        pane: {
            size: '85%',
            startAngle: 0,
            endAngle: 360
        }
    }
} satisfies SampleGeneratorConfig;