import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.alignThresholds',
        value: true
    }],
    chartOptionsExtra: {
        yAxis: [{
            id: 'primary',
            title: {
                text: 'Primary Axis'
            },
            plotLines: [{
                value: 0,
                width: 2,
                zIndex: 1
            }],
            gridLineWidth: 0
        }, {
            id: 'secondary',
            title: {
                text: 'Secondary Axis'
            },
            opposite: true
        }],
        series: [{
            data: [-5, -11, -1, 2],
            yAxis: 'primary'
        }, {
            data: [1000, 1001, 1002, 1004],
            yAxis: 'secondary'
        }]
    }
} satisfies SampleGeneratorConfig;