import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.reversedStacks',
        value: true
    }],
    templates: ['categories-4'],
    chartOptionsExtra: {
        chart: {
            type: 'column'
        },
        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [4, 3, 5, 2]
        }]
    }
} satisfies SampleGeneratorConfig;