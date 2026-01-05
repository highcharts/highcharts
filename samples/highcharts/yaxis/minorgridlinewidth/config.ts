import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minorGridLineWidth',
        value: 2,
        min: 0,
        max: 5,
        step: 0.5
    }],
    chartOptionsExtra: {
        yAxis: {
            gridLineColor: '#808080',
            gridLineWidth: 2,
            minorGridLineColor: '#80808080',
            minorTicks: true
        }
    }
} satisfies SampleGeneratorConfig;