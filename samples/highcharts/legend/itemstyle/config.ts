import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.itemStyle.color',
        value: '#2caffe'
    }, {
        path: 'legend.itemStyle.fontWeight',
        value: 'bold'
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [5, 3, 4, 2]
        }, {
            data: [4, 2, 5, 3]
        }]
    }
} satisfies SampleGeneratorConfig;