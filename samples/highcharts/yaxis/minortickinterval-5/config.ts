import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minorTickInterval',
        value: 5,
        min: 1,
        max: 10
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;