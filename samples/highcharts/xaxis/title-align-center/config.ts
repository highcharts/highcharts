import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.title.align',
        value: 'middle'
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