import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.title.margin',
        value: 60,
        min: 0,
        max: 150
    }, {
        path: 'yAxis.title.text',
        value: 'Y-Axis Title'
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;