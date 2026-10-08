import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.width',
        type: 'text',
        value: '30rem'
    }],
    chartOptionsExtra: {
        chart: {
            borderWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;
