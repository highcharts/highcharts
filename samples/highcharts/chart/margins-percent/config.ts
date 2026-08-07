import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'chart.width',
        value: '400'
    }, {
        path: 'chart.marginLeft',
        value: '20%'
    }, {
        path: 'chart.marginRight',
        value: '20%'
    }],

    chartOptionsExtra: {
        title: {
            text: 'Chart with percentage margins'
        },
        chart: {
            borderWidth: 1,
            plotBorderWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;