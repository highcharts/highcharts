import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.dateTimeLabelFormats.year.boundary',
        value: '%b<br>%Y'
    }, {
        path: 'xAxis.dateTimeLabelFormats.month.main',
        value: '%b'
    }],
    templates: ['datetime'],
    chartOptionsExtra: {
        title: {
            text: 'Demo of axis label boundary'
        },
        series: [{
            data: [1, 3, 2, 6, 3, 5, 7, 5, 1, 2, 3, 2],
            pointInterval: 2
        }]
    }
} satisfies SampleGeneratorConfig;