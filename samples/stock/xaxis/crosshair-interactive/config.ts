import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.crosshair.snap',
        value: true
    }, {
        path: 'yAxis.crosshair.label.enabled',
        value: true
    }, {
        path: 'yAxis.crosshair.label.format',
        value: '{value:.2f}'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;