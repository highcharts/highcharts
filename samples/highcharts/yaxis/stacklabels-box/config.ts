import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.stackLabels.backgroundColor',
        value: '#80808040'
    }, {
        path: 'yAxis.stackLabels.borderColor',
        value: '#80808080'
    }, {
        path: 'yAxis.stackLabels.borderWidth',
        value: 1,
        min: 0,
        max: 3
    }, {
        path: 'yAxis.stackLabels.borderRadius',
        value: 5,
        min: 0,
        max: 10
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        chart: {
            type: 'column'
        },
        title: {
            text: 'Stack labels box options'
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },
        yAxis: {
            stackLabels: {
                enabled: true,
                y: -5
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