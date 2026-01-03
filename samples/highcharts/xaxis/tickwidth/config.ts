import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.tickWidth',
        value: 2,
        min: 0,
        max: 10
    }],
    templates: ['linear-12']
} satisfies SampleGeneratorConfig;