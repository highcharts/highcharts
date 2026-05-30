import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.align',
        value: 'right'
    }, {
        path: 'legend.verticalAlign',
        value: 'middle'
    }, {
        path: 'legend.layout',
        value: 'vertical'
    }, {
        path: 'legend.x',
        value: 0
    }, {
        path: 'legend.y',
        value: 0
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