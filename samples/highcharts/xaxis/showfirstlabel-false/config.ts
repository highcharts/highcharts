import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.showFirstLabel',
        value: false
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;