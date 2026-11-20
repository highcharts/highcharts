import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.borderRadius',
        value: 7
    }],
    chartOptionsExtra: {
        chart: {
            borderWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;