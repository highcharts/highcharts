import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.tickPosition',
        value: 'outside',
        options: ['inside', 'outside']
    }],
    templates: ['linear-12']
} satisfies SampleGeneratorConfig;