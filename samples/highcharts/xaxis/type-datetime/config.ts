import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.type',
        value: 'datetime'
    }],
    templates: ['linear-12', 'datetime'],
    chartOptionsExtra: {

    }
} satisfies SampleGeneratorConfig;