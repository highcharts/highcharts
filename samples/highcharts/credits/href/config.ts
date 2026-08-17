import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'credits.href',
        value: 'https://www.example.com'
    }, {
        path: 'credits.text',
        value: 'Example.com'
    }]
} satisfies SampleGeneratorConfig;