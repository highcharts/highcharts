import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.showEmpty',
        value: false
    }],
    chartOptionsExtra: {
        subtitle: {
            text: 'To see the effect, hide the series by clicking the legend'
        },
        yAxis: {
            lineWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;