import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'series[0].step',
        value: 'left',
        options: ['left', 'center', 'right']
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        rangeSelector: {
            selected: 0
        }
    }
} satisfies SampleGeneratorConfig;