import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'credits.position.align',
        type: 'select',
        value: 'left',
        options: ['left', 'center', 'right']
    }]
} satisfies SampleGeneratorConfig;