import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.endOnTick',
        value: false
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        yAxis: {
            lineWidth: 1,
            type: 'logarithmic'
        }
    }
} satisfies SampleGeneratorConfig;