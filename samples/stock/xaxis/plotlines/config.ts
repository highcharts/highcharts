import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.plotLines[0].value',
        value: 0.85,
        min: 0.6,
        max: 1,
        step: 0.01
    }, {
        path: 'yAxis.plotLines[0].color',
        value: '#00c000'
    }, {
        path: 'yAxis.plotLines[0].width',
        value: 1,
        min: 0,
        max: 5
    }, {
        path: 'yAxis.plotLines[0].dashStyle',
        value: 'Solid'
    }, {
        path: 'yAxis.plotLines[0].label.text',
        value: 'Plot line'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;