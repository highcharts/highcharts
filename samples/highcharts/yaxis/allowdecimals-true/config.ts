import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.allowDecimals',
        value: true
    }, {
        path: 'yAxis.allowDecimals',
        value: true
    }],
    templates: [],
    chartOptionsExtra: {
        series: [{
            data: [0.5, 1.5, 1, 2]
        }],
        xAxis: {
            tickPixelInterval: 50
        }
    }
} satisfies SampleGeneratorConfig;