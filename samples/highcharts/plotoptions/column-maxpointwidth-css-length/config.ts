import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'plotOptions.column.maxPointWidth',
        min: 0.5,
        max: 6,
        value: '3rem'
    }]
} satisfies SampleGeneratorConfig;
