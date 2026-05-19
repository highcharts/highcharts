import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.itemHiddenStyle.color',
        value: '#80808080'
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [5, 3, 4, 2],
            visible: false
        }, {
            data: [4, 2, 5, 3],
            visible: false
        }]
    }
} satisfies SampleGeneratorConfig;