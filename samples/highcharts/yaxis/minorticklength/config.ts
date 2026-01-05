import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minorTickLength',
        value: 5,
        min: -10,
        max: 30,
        step: 1
    }],
    chartOptionsExtra: {
        yAxis: {
            lineWidth: 1,
            minorTicks: true,
            minorTickWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;