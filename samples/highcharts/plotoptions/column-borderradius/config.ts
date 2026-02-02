import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'plotOptions.column.borderRadius.radius',
        min: 0,
        max: 50
    }, {
        path: 'plotOptions.column.borderRadius.scope',
        options: ['stack', 'point']
    }, {
        path: 'plotOptions.column.borderRadius.where',
        options: ['end', 'all']
    }],
    chartOptionsExtra: {
        plotOptions: {
            column: {
                borderRadius: {
                    radius: '50%',
                    scope: 'stack',
                    where: 'end'
                },
                stacking: 'normal'
            }
        },

        series: [{
            data: [1, 4, 3]
        }, {
            data: [8, 1, 5]
        }, {
            data: [1, 2, 4]
        }]
    }
} satisfies SampleGeneratorConfig;