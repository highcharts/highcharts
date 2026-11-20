import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.alignTicks',
        value: false
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        yAxis: [{
            id: 'primary',
            title: {
                text: 'Primary Axis'
            }
        }, {
            id: 'secondary',
            title: {
                text: 'Secondary Axis'
            },
            opposite: true,
            gridLineWidth: 0
        }],
        series: [{
            data: [
                29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
                194.1, 95.6, 54.4
            ]
        }, {
            data: [
                129.9, 271.5, 306.4, 29.2, 544.0, 376.0, 435.6, 348.5, 216.4,
                294.1, 35.6, 354.4
            ],
            yAxis: 'secondary'
        }]
    }
} satisfies SampleGeneratorConfig;