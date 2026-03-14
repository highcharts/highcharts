import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.dateTimeLabelFormats.month.boundary',
        value: '<i><b>%B</b></i>'
    }, {
        path: 'xAxis.dateTimeLabelFormats.day.main',
        value: '%e of %b'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'chart',
    chartOptionsExtra: {
        title: {
            text: 'Demo of axis label boundary'
        },
        xAxis: {
            type: 'datetime',
            min: '2020-01-20',
            max: '2020-02-07'
        }
    }
} satisfies SampleGeneratorConfig;