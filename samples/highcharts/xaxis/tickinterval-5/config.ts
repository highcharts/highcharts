import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.tickInterval',
        value: 5,
        min: 1,
        max: 12
    }],
    templates: ['linear-12']
} satisfies SampleGeneratorConfig;