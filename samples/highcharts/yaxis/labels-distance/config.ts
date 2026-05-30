import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.labels.distance',
        value: '75%'
    }],
    modules: ['highcharts-more', 'modules/solid-gauge'],
    chartOptionsExtra: {
        pane: {
            center: ['50%', '80%'],
            size: '130%',
            startAngle: -90,
            endAngle: 90,
            background: {
                innerRadius: '50%',
                outerRadius: '100%',
                shape: 'arc'
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            lineWidth: 0,
            tickWidth: 0,
            minorTickWidth: 0,
            tickAmount: 2,
            labels: {
                y: 25
            }
        },
        series: [{
            type: 'solidgauge',
            innerRadius: '50%',
            radius: '100%',
            data: [54.4]
        }]
    }
} satisfies SampleGeneratorConfig;