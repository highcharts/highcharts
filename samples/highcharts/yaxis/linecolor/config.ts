import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.lineColor',
        value: '#00c000'
    }],
    chartOptionsExtra: {
        yAxis: {
            lineWidth: 2
        }
    }
} satisfies SampleGeneratorConfig;