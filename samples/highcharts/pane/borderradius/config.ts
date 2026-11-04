import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'pane.borderRadius',
        value: '50%',
        max: 50
    }],
    modules: ['highcharts-more'],
    templates: ['gauge']
} satisfies SampleGeneratorConfig;