import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.padding',
        value: 8,
        max: 20
    }, {
        path: 'legend.itemMarginTop',
        value: 5,
        max: 20
    }, {
        path: 'legend.itemMarginBottom',
        value: 5,
        max: 20
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        title: {
            text: 'Demo of legend padding and item margins'
        },
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 1,
            layout: 'vertical'
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