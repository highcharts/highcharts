import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.type',
        value: 'logarithmic',
        options: ['linear', 'logarithmic']
    }],
    modules: ['highcharts-more'],
    templates: ['gauge'],
    chartOptionsExtra: {
        yAxis: {
            min: 1,
            max: 100,
            endOnTick: false
        }
    }
} satisfies SampleGeneratorConfig;