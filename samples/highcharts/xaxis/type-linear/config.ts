import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.type',
        value: 'linear'
    }],
    templates: ['linear-12']
} satisfies SampleGeneratorConfig;