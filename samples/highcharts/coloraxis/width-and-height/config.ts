import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'colorAxis.width',
        value: '50%'
    }, {
        path: 'colorAxis.height',
        value: 10,
        min: 4,
        max: 30
    }],
    modules: ['highcharts-more', 'modules/coloraxis']
} satisfies SampleGeneratorConfig;