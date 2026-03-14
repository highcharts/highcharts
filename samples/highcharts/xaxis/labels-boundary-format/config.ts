import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.js';

export default {
    controls: [{
        path: 'xAxis.labels.format',
        value: `{#if (eq boundary "month")}{value: %b <b>%Y</b>}
        {else}{value: %e of %b}{/if}`
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'chart',
    chartOptionsExtra: {
        title: {
            text: 'Demo of axis label boundary format'
        },
        xAxis: {
            type: 'datetime',
            min: '2020-01-20',
            max: '2020-02-07'
        }
    }
} satisfies SampleGeneratorConfig;