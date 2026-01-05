import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.tickColor',
        value: '#00c000'
    }, {
        path: 'xAxis.tickLength',
        value: 10,
        min: 0,
        max: 50
    }, {
        path: 'xAxis.tickWidth',
        value: 2,
        min: 0,
        max: 5
    }, {
        path: 'xAxis.tickPosition',
        value: 'inside'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;