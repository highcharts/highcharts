import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.startOnTick',
        value: false
    }, {
        path: 'xAxis.endOnTick',
        value: false
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        rangeSelector: {
            selected: 2
        }
    }
} satisfies SampleGeneratorConfig;