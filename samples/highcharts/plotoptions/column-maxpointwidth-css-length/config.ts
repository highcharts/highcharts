import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'plotOptions.column.maxPointWidth',
        type: 'text',
        value: '3rem'
    }]
} satisfies SampleGeneratorConfig;
