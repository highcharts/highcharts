import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.width',
        type: 'number',
        min: 10,
        max: 50,
        value: '30rem'
    }],
    chartOptionsExtra: {
        chart: {
            borderWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;
