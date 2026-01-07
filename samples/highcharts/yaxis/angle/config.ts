import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.angle',
        value: 30,
        max: 360
    }],
    modules: ['highcharts-more'],
    templates: ['linear-12'],
    chartOptionsExtra: {
        chart: {
            polar: true
        },
        plotOptions: {
            series: {
                pointInterval: 30
            }
        },
        legend: {
            enabled: false
        },
        xAxis: {
            min: 0,
            max: 360,
            tickInterval: 30
        },
        yAxis: {
            lineWidth: 2
        }
    }
} satisfies SampleGeneratorConfig;