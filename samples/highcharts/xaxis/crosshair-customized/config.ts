import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.crosshair.width',
        value: 3,
        min: 1,
        max: 5
    }, {
        path: 'xAxis.crosshair.color',
        value: '#008800'
    }, {
        path: 'yAxis.crosshair.width',
        value: 3,
        min: 1,
        max: 5
    }, {
        path: 'yAxis.crosshair.color',
        value: '#008800'
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;