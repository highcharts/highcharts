import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'series[0].data[11]',
        value: 1,
        min: 1,
        max: 100000,
        step: 1
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        yAxis: {
            type: 'logarithmic',
            minorTickInterval: 'auto'
        },
        title: {
            text: 'Demo of <em>yAxis.minorTickInterval</em> on logarithmic axis'
        },
        series: [{
            type: 'column',
            data: [
                0.29, 71.5, 1.06, 1292, 14.4, 1.760, 135, 1.48, 0.216, 0.194,
                9.56, 1.1
            ]
        }]
    }
} satisfies SampleGeneratorConfig;