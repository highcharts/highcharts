import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.labels.rotation',
        value: -45,
        min: -90,
        max: 90
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;