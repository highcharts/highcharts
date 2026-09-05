import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'pane.thickness',
        value: 10
    }],
    modules: ['highcharts-more'],
    templates: ['gauge']
} satisfies SampleGeneratorConfig;