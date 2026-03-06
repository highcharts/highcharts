import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.dateTimeLabelFormats.year.boundary',
        value: '<b>%Y</b>'
    }, {
        path: 'xAxis.dateTimeLabelFormats.month.main',
        value: '%b'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        title: {
            text: 'Demo of axis label boundary'
        },
        rangeSelector: {
            selected: 4
        }
    }
} satisfies SampleGeneratorConfig;