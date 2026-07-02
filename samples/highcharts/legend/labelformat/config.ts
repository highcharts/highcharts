import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.labelFormat',
        value: '{name} <small>(Click to hide)</small>',
        type: 'text'
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        legend: {
            align: 'right',
            layout: 'proximate'
        },
        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [5, 3, 4, 2]
        }, {
            data: [4, 2, 5, 3]
        }]
    }
} satisfies SampleGeneratorConfig;