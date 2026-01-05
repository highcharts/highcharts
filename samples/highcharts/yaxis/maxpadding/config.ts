import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.maxPadding',
        value: 0.25,
        min: 0,
        max: 0.5,
        step: 0.01
    }, {
        path: 'yAxis.endOnTick',
        value: false,
        inTitle: false
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        yAxis: {
            lineWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;