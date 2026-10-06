import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'tooltip.followTouchMove',
        value: true
    }],
    templates: ['linear-12', 'datetime']
} satisfies SampleGeneratorConfig;