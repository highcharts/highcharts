import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.borderRadius',
        value: 5
    }],
    chartOptionsExtra: {
        legend: {
            borderWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;