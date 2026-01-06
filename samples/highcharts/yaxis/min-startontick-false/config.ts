import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.min',
        value: -50,
        min: -100,
        max: 0
    }, {
        path: 'yAxis.startOnTick',
        value: false
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;