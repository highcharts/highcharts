import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.js';

export default {
    controls: [{
        path: 'xAxis.labels.format',
        value: `{#if (eq boundary "year")}{value:%b<br>%Y}
        {else}{value:%b}{/if}`
    }],
    templates: ['datetime'],
    chartOptionsExtra: {
        title: {
            text: 'Demo of axis label boundary'
        },
        series: [{
            data: [1, 3, 2, 6, 3, 5, 7, 5, 1, 2, 3, 2],
            pointInterval: 2
        }]
    }
} satisfies SampleGeneratorConfig;