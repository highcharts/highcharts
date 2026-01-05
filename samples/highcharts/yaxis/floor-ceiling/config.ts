import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.ceiling',
        value: 250,
        min: 100,
        max: 300
    }, {
        path: 'yAxis.endOnTick',
        value: false
    }, {
        path: 'yAxis.floor',
        value: 0,
        min: 0,
        max: 100
    }, {
        path: 'yAxis.startOnTick',
        value: false
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        title: {
            text: 'Demo of Y-Axis Floor and Ceiling'
        }
    }
} satisfies SampleGeneratorConfig;