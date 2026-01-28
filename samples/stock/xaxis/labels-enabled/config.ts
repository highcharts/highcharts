import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.labels.enabled',
        value: false
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;