import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.labels.format',
        value: '${value:.2f} USD'
    }],
    chartOptionsExtra: {
        series: [{
            data: [100, 300, 200, 400]
        }]
    }
} satisfies SampleGeneratorConfig;