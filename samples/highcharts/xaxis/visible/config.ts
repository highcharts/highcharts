import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.visible',
        value: true
    }, {
        path: 'yAxis.visible',
        value: false
    }],
    templates: ['column', 'categories-4']
} satisfies SampleGeneratorConfig;