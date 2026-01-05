import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.title.offset',
        value: 50,
        min: -20,
        max: 70
    }],
    chartOptionsExtra: {
        yAxis: {
            lineWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;