import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.labels.reserveSpace',
        value: false
    }],
    chartOptionsExtra: {
        chart: {
            type: 'column',
            borderWidth: 1
        },

        credits: {
            enabled: false
        },

        legend: {
            enabled: false
        },

        xAxis: {
            categories: ['Product 1', 'Product 2', 'Yet another product'],
            labels: {
                rotation: -90,
                align: 'left',
                y: -5,
                style: {
                    color: '#FFFFFF',
                    fontSize: '12pt',
                    fontWeight: 'bold',
                    textOutline: '1px contrast'
                }
            },
            tickWidth: 0
        },

        series: [{
            data: [39.9, 71.5, 106.4],
            dataLabels: {
                enabled: true
            }
        }]
    }
} satisfies SampleGeneratorConfig;