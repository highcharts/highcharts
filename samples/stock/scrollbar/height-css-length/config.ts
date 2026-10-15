import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'scrollbar.height',
        min: 0.5,
        max: 3,
        value: '1.5rem'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart'
} satisfies SampleGeneratorConfig;
