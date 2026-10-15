import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.height',
        type: 'number',
        min: 10,
        max: 40,
        value: '20rem'
    }],
    chartOptionsExtra: {
        chart: {
            borderWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;
