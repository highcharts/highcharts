import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.gridLineWidth',
        value: 1
    }],
    modules: ['highcharts-more'],
    templates: ['gauge'],
    chartOptionsExtra: {
        yAxis: {
            gridLineColor: 'var(--highcharts-background-color)'
        }
    }
} satisfies SampleGeneratorConfig;