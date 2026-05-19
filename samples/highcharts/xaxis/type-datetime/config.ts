import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.type',
        value: 'datetime'
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {

    }
} satisfies SampleGeneratorConfig;