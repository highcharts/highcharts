import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.height',
        type: 'text',
        value: '20rem'
    }],
    chartOptionsExtra: {
        chart: {
            borderWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;
