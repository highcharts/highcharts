import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.min',
        value: '2020-01-01',
        type: 'text'
    }, {
        path: 'xAxis.max',
        value: '2020-12-31',
        type: 'text'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;