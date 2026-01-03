import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.showFirstLabel',
        value: false
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;