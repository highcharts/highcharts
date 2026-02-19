import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.max',
        value: 300,
        min: 10,
        max: 300
    }, {
        path: 'yAxis.endOnTick',
        value: true
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        title: {
            text: 'Demo of <em>yAxis.max</em> on logarithmic axis'
        },
        yAxis: {
            lineWidth: 1,
            type: 'logarithmic'
        }
    }
} satisfies SampleGeneratorConfig;