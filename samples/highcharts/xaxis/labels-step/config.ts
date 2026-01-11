import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.labels.step',
        value: 2,
        min: 0,
        max: 5
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;