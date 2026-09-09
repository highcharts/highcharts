import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.angle',
        value: 350,
        min: 0,
        max: 360
    }],
    modules: ['highcharts-more'],
    chartOptionsExtra: {
        chart: {
            inverted: true,
            polar: true,
            type: 'column'
        },
        xAxis: {
            lineWidth: 2,
            tickInterval: 1
        },
        series: [{
            data: [
                29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
                194.1, 95.6, 54.4
            ]
        }]
    },
    templates: ['linear-12']
} satisfies SampleGeneratorConfig;