import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.title.align',
        value: 'low'
    }, {
        path: 'xAxis.title.text',
        value: 'X-Axis Title'
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        }
    }
} satisfies SampleGeneratorConfig;