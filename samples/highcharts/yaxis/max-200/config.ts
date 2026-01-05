import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.max',
        value: 200,
        min: 100,
        max: 300
    }, {
        path: 'yAxis.endOnTick',
        value: true
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        title: {
            text: 'Demo of <em>yAxis.max</em>'
        },
        yAxis: {
            lineWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;