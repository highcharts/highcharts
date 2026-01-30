import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.stackLabels.enabled',
        value: true
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        chart: {
            type: 'column'
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        series: [{
            data: [
                29.9, 71.5, 106.4, 129.2
            ]
        }, {
            data: [
                144.0, 176.0, 135.6, 148.5
            ]
        }]
    }
} satisfies SampleGeneratorConfig;