import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'tooltip.borderColor',
        nullable: true,
        value: '#000000'
    }],
    templates: ['column'],
    chartOptionsExtra: {
        tooltip: {
            borderWidth: 2
        }
    }
} satisfies SampleGeneratorConfig;