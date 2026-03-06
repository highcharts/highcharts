import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.itemHoverStyle.color',
        value: '#2caffe'
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        subtitle: {
            text: 'Hover legend items to see the effect'
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