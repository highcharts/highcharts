import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'scrollbar.enabled',
        value: false
    }],
    templates: [],
    dataFile: 'usdeur.json',
    factory: 'stockChart',
    chartOptionsExtra: {
        rangeSelector: {
            selected: 1
        },
        series: [{
            type: 'line',
            name: 'USD to EUR'
        }]
    }
} satisfies SampleGeneratorConfig;
