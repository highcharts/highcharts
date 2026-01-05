import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.range',
        value: 10000000000,
        min: 10000000000,
        max: 90000000000,
        step: 10000000000
    }],
    controlsDescription: 'The range is in terms of milliseconds',
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;