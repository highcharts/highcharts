import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.stackLabels.style.color',
        value: '#00c000'
    }, {
        path: 'yAxis.stackLabels.style.fontSize',
        value: '0.9em'
    }, {
        path: 'yAxis.stackLabels.style.fontWeight',
        value: 'bold'
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
        yAxis: {
            stackLabels: {
                enabled: true,
                style: {
                    textOutline: 'none'
                }
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