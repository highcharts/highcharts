import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    paths: [
        'series[0].connectNulls=false'
    ],
    modules: ['modules/boost'],
    templates: ['linear-12'],
    chartOptionsExtra: {

        boost: {
            useGPUTranslations: true,
            seriesThreshold: 1
        },

        tooltip: {
            valueDecimals: 2
        },

        series: [{
            data: [
                [0, 1],
                [1, 5],
                [2, null],
                [3, 3],
                [4, 0]
            ]
        }]
    }
} satisfies SampleGeneratorConfig;