import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.tickAmount',
        value: 8,
        min: 2,
        max: 20
    }]
} satisfies SampleGeneratorConfig;