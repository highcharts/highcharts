import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minorGridLineColor',
        value: '#80808080'
    }],
    chartOptionsExtra: {
        yAxis: {
            gridLineColor: '#808080',
            minorTicks: true
        }
    }
} satisfies SampleGeneratorConfig;