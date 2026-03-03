import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.itemMarginTop',
        value: 10
    }, {
        path: 'legend.itemMarginBottom',
        value: 10
    }],
    templates: [],
    chartOptionsExtra: {
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical',
            borderWidth: 1
        },
        series: [{
            data: [6, 4, 2],
            name: 'First'
        }, {
            data: [7, 3, 2],
            name: 'Second'
        }, {
            data: [9, 4, 8],
            name: 'Third'
        }, {
            data: [1, 2, 6],
            name: 'Fourth'
        }]
    }
} satisfies SampleGeneratorConfig;