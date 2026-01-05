import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minorTickInterval',
        value: 0.1,
        min: 0.1,
        max: 1,
        step: 0.1
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        yAxis: {
            type: 'logarithmic',
            minorTickInterval: 0.1
        },
        series: [{
            data: [
                0.29, 71.5, 1.06, 1292, 14.4, 1.760, 135, 1.48, 0.216, 0.194,
                9.56, 54.4
            ]
        }]
    }
} satisfies SampleGeneratorConfig;