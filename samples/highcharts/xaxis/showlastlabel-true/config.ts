import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.showLastLabel',
        value: true
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;