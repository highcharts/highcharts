import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.js';

export default {
    controls: [{
        path: 'xAxis.uniformDecimals',
        value: true
    }, {
        path: 'yAxis.uniformDecimals',
        value: true
    }],
    templates: [],
    chartOptionsExtra: {
        series: [{
            data: [0.5, 1.5, 1, 2]
        }],
        xAxis: {
            tickInterval: 0.25
        }
    }
} satisfies SampleGeneratorConfig;