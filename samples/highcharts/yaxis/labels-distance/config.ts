import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.labels.distance',
        value: '-20%',
        min: -100,
        max: 50
    }],
    modules: ['highcharts-more', 'modules/solid-gauge'],
    templates: ['gauge'],
    chartOptionsExtra: {
        chart: {
            type: 'solidgauge',
            marginBottom: 50
        },
        subtitle: {
            text: 'Initially placed in the middle of the solid gauge band'
        },
        pane: {
            startAngle: -90,
            endAngle: 90,
            innerSize: '60%'
        },
        yAxis: {
            plotBands: [],
            min: 0,
            max: 100,
            tickAmount: 2,
            labels: {
                y: 25
            }
        },
        series: [{
            data: [54.4]
        }]
    }
} satisfies SampleGeneratorConfig;