import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.symbolWidth',
        value: 16,
        max: 50
    }],
    templates: [],
    chartOptionsExtra: {
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