import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.reversedStacks',
        value: false
    }],
    chartOptionsExtra: {
        plotOptions: {
            series: {
                stacking: 'normal'
            }
        },
        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [4, 2, 3, 1]
        }, {
            data: [4, 2, 3, 1]
        }]
    }
} satisfies SampleGeneratorConfig;