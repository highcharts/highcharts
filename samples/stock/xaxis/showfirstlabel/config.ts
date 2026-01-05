import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.showFirstLabel',
        value: false
    }, {
        path: 'yAxis.showLastLabel',
        value: true
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        yAxis: {
            labels: {
                y: 12
            }
        }
    }
} satisfies SampleGeneratorConfig;