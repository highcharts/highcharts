import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.tickPosition',
        value: 'inside',
        options: ['inside', 'outside']
    }],
    templates: ['linear-12']
} satisfies SampleGeneratorConfig;