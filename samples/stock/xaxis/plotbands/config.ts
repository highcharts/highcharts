import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.plotBands[0].from',
        value: 0.75,
        min: 0.5,
        max: 0.8,
        step: 0.01
    }, {
        path: 'yAxis.plotBands[0].to',
        value: 0.85,
        min: 0.8,
        max: 1,
        step: 0.01
    }, {
        path: 'yAxis.plotBands[0].color',
        value: '#00c00019'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;