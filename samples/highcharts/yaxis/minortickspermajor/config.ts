import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

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