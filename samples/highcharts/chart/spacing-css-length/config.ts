import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.spacingTop',
        type: 'text',
        value: '3rem'
    }, {
        path: 'chart.spacingRight',
        type: 'text',
        value: '2rem'
    }, {
        path: 'chart.spacingBottom',
        type: 'text',
        value: '3rem'
    }, {
        path: 'chart.spacingLeft',
        type: 'text',
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
