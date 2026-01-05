import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.alternateGridColor',
        value: '#88cc881a'
    }, {
        path: 'yAxis.alternateGridColor',
        value: '#8888cc1a'
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;