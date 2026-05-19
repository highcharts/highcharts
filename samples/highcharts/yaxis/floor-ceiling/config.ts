import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.ceiling',
        value: 250,
        min: 100,
        max: 300
    }, {
        path: 'yAxis.endOnTick',
        value: false,
        inTitle: false
    }, {
        path: 'yAxis.floor',
        value: 0,
        min: 0,
        max: 100
    }, {
        path: 'yAxis.startOnTick',
        value: false,
        inTitle: false
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;