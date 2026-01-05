import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.min',
        value: -50,
        min: -100,
        max: 0
    }, {
        path: 'yAxis.startOnTick',
        value: true
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        title: {
            text: 'Demo of <em>yAxis.min</em> and <em>startOnTick</em>'
        }
    }
} satisfies SampleGeneratorConfig;