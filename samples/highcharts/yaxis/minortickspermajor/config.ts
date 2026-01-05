import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minorTicksPerMajor',
        value: 2,
        min: 1,
        max: 10
    }],
    chartOptionsExtra: {
        yAxis: {
            minorTicks: true
        }
    }
} satisfies SampleGeneratorConfig;