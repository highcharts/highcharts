import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.minorGridLineDashStyle',
        value: 'Dash'
    }],
    chartOptionsExtra: {
        yAxis: {
            gridLineColor: '#808080',
            minorGridLineColor: '#80808080',
            minorTicks: true
        }
    }
} satisfies SampleGeneratorConfig;