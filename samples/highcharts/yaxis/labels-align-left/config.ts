import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.labels.align',
        value: 'left'
    }, {
        path: 'yAxis.labels.y',
        value: -2,
        min: -5,
        max: 20
    }],
    chartOptionsExtra: {
        series: [{
            data: [100, 300, 200, 400]
        }]
    }
} satisfies SampleGeneratorConfig;