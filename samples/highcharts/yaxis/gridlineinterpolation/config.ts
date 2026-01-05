import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.gridLineInterpolation',
        value: 'polygon'
    }],
    modules: ['highcharts-more'],
    templates: [],
    chartOptionsExtra: {
        chart: {
            polar: true
        },
        plotOptions: {
            series: {
                pointInterval: 45
            }
        },
        legend: {
            enabled: false
        },
        xAxis: {
            lineWidth: 0,
            min: 0,
            max: 360,
            tickInterval: 45
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5],
        }]
    }
} satisfies SampleGeneratorConfig;