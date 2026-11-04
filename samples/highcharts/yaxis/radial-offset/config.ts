import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.offset',
        max: 50
    }],
    modules: ['highcharts-more'],
    templates: ['gauge'],
    chartOptionsExtra: {
        yAxis: {
            lineWidth: 1,
            offset: '-20%'
        }
    }
} satisfies SampleGeneratorConfig;