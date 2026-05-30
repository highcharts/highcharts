import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.minorTickPosition',
        value: 'inside'
    }],
    chartOptionsExtra: {
        yAxis: {
            lineWidth: 1,
            minorTicks: true,
            minorTickWidth: 3
        }
    }
} satisfies SampleGeneratorConfig;