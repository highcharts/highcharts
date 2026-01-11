import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    paths: [
        'xAxis.crosshair=true',
        'yAxis.crosshair=true'
    ],
    chartOptionsExtra: {
        chart: {
            type: 'line'
        },
        series: [{
            data: [
                29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
                194.1, 95.6, 54.4
            ]
        }]
    }
} satisfies SampleGeneratorConfig;