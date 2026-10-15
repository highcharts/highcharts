import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.spacingTop',
        min: 0,
        max: 6,
        value: '3rem'
    }, {
        path: 'chart.spacingRight',
        min: 0,
        max: 6,
        value: '2rem'
    }, {
        path: 'chart.spacingBottom',
        min: 0,
        max: 6,
        value: '3rem'
    }, {
        path: 'chart.spacingLeft',
        min: 0,
        max: 6,
        value: '4rem'
    }],
    details: {
        name: 'Demo of chart.spacing'
    },
    chartOptionsExtra: {
        title: {
            text: 'Demo of <em>chart.spacing</em>'
        },
        chart: {
            borderWidth: 1,
            plotBorderWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;
