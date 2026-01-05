import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minorTickWidth',
        value: 3,
        min: 0,
        max: 5
    }],
    chartOptionsExtra: {
        yAxis: {
            minorTicks: true
        }
    }
} satisfies SampleGeneratorConfig;