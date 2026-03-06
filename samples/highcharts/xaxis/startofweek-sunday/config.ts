import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.startOfWeek',
        value: 0,
        min: 0,
        max: 1
    }],
    templates: ['datetime'],
    chartOptionsExtra: {
        plotOptions: {
            series: {
                pointInterval: 7,
                pointIntervalUnit: 'day'
            }
        },
        series: [{
            data: [1, 3, 2, 4]
        }],
        xAxis: {
            labels: {
                format: '{value:%[aeb]}'
            },
            tickInterval: 7 * 24 * 3600 * 1000 // one week
        }
    }
} satisfies SampleGeneratorConfig;