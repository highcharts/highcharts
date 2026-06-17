import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'pane.margin',
        value: 30
    }],
    modules: ['highcharts-more'],
    templates: ['gauge'],
    chartOptionsExtra: {
        chart: {
            plotBorderWidth: 1
        },
        pane: {
            margin: 30
        }
    }
} satisfies SampleGeneratorConfig;