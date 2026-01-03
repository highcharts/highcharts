import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.type',
        value: 'linear'
    }],
    templates: ['linear-12']
} satisfies SampleGeneratorConfig;