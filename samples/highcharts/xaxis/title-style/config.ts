import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.title.style.color',
        value: '#00c000'
    }, {
        path: 'yAxis.title.style.fontSize',
        value: '0.9em',
        min: 0.5,
        max: 2,
        step: 0.1
    }, {
        path: 'yAxis.title.style.fontWeight',
        value: 'bold'
    }, {
        path: 'yAxis.title.text',
        value: 'Y-Axis Title'
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;