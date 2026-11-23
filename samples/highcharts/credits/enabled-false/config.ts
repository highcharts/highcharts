import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'credits.enabled',
        value: false
    }]
} satisfies SampleGeneratorConfig;