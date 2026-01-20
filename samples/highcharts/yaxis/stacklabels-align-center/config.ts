import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.stackLabels.align',
        value: 'center'
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        chart: {
            type: 'column'
        },
        plotOptions: {
            column: {
                groupPadding: 0,
                pointPadding: 0,
                stacking: 'normal'
            }
        },
        yAxis: {
            stackLabels: {
                enabled: true
            }
        },
        series: [{
            data: [
                29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
                194.1, 95.6, 54.4
            ]
        }, {
            data: [
                144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9,
                71.5, 106.4, 129.2
            ]
        }]
    }
} satisfies SampleGeneratorConfig;