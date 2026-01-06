import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.min',
        value: 0.7,
        min: 0,
        max: 0.8,
        step: 0.01
    }, {
        path: 'yAxis.startOnTick',
        value: false,
        inTitle: false
    }, {
        path: 'yAxis.max',
        value: 0.9,
        min: 0.8,
        max: 1,
        step: 0.01
    }, {
        path: 'yAxis.endOnTick',
        value: false,
        inTitle: false
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;