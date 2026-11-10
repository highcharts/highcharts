import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.alternateGridColor',
        value: '#88cc881a',
        nullable: true
    }, {
        path: 'yAxis.alternateGridColor',
        value: '#8888cc1a',
        nullable: true
    }],
    templates: ['categories-12']
} satisfies SampleGeneratorConfig;