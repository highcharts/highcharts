import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'pane.background.backgroundColor'
    }, {
        path: 'pane.background.borderColor'
    }, {
        path: 'pane.background.borderWidth',
        value: 1
    }],
    modules: ['highcharts-more'],
    templates: ['gauge']
} satisfies SampleGeneratorConfig;