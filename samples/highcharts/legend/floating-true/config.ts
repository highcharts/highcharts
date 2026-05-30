import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'legend.floating',
        value: true
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        legend: {
            align: 'right',
            verticalAlign: 'middle'
        }
    }
} satisfies SampleGeneratorConfig;