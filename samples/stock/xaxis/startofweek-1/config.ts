import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.startOfWeek',
        value: 1,
        min: 0,
        max: 6
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        rangeSelector: {
            selected: 1
        },
        xAxis: {
            dateTimeLabelFormats: {
                week: '%a,<br/>%e. %b'
            }
        }
    }
} satisfies SampleGeneratorConfig;