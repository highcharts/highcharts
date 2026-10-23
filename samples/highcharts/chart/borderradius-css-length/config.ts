import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.borderRadius',
        min: 0,
        max: 5,
        value: '2rem'
    }],
    chartOptionsExtra: {
        chart: {
            borderWidth: 2
        }
    }
} satisfies SampleGeneratorConfig;
