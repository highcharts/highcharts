import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.marginTop',
        type: 'text',
        value: '5rem'
    }, {
        path: 'chart.marginRight',
        type: 'text',
        value: '3rem'
    }, {
        path: 'chart.marginBottom',
        type: 'text',
        value: '4rem'
    }, {
        path: 'chart.marginLeft',
        type: 'text',
        value: '6rem'
    }],
    details: {
        name: 'Demo of chart.margin'
    },
    chartOptionsExtra: {
        title: {
            text: 'Demo of <em>chart.margin</em>'
        },
        chart: {
            borderWidth: 1,
            plotBorderWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;
