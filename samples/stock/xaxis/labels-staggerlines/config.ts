import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.labels.staggerLines',
        value: 2,
        min: 0,
        max: 5
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        rangeSelector: {
            selected: 4
        }
    }
} satisfies SampleGeneratorConfig;