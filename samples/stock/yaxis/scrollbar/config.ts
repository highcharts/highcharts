import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.scrollbar.enabled',
        value: true
    }, {
        path: 'yAxis.scrollbar.showFull',
        value: false
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        chart: {
            zooming: {
                type: 'xy'
            }
        }
    }
} satisfies SampleGeneratorConfig;