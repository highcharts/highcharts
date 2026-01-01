import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.opposite',
        value: true
    }, {
        path: 'yAxis.opposite',
        value: true
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;