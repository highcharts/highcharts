import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.tickPixelInterval',
        value: 50,
        min: 1,
        max: 400
    }],
    templates: ['linear-12']
} satisfies SampleGeneratorConfig;