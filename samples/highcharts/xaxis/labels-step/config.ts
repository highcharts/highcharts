import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.labels.step',
        value: 2,
        min: 0,
        max: 5
    }],
    templates: ['line']
} satisfies SampleGeneratorConfig;