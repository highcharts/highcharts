import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    paths: [
        'legend.borderRadius'
    ],
    chartOptionsExtra: {
        legend: {
            borderWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;