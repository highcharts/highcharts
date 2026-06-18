import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'credits.position.align',
        type: 'select',
        options: ['left', 'center', 'right']
    }, {
        path: 'credits.position.x'
    }, {
        path: 'credits.position.verticalAlign',
        type: 'select',
        options: ['top', 'middle', 'bottom']
    }, {
        path: 'credits.position.y'
    }, {
        path: 'credits.position.relativeTo',
        type: 'select',
        value: 'spacingBox',
        options: ['chartBox', 'plotBox', 'spacingBox']
    }]
} satisfies SampleGeneratorConfig;