import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.gridLineInterpolation',
        value: 'circle'
    }],
    modules: ['highcharts-more'],
    chartOptionsExtra: {
        chart: {
            polar: true,
            inverted: true
        },
        xAxis: {
            gridLineColor: '#888',
            tickInterval: 1
        },
        legend: {
            enabled: false
        }
    }
} satisfies SampleGeneratorConfig;