import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.crosshair',
        value: true
    }, {
        path: 'yAxis.crosshair',
        value: true
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;