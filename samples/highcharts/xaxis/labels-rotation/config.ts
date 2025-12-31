import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.labels.rotation',
        value: -45,
        min: -90,
        max: 90
    }],
    templates: ['line']
} satisfies SampleGeneratorConfig;