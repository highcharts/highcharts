import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.softMax',
        value: 10,
        min: 0,
        max: 10
    }],
    chartOptionsExtra: {
        yAxis: {
            endOnTick: false,
            lineWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;