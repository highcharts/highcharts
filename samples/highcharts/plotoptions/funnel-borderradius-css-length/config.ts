import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'plotOptions.funnel.borderRadius',
        type: 'text',
        value: '1rem'
    }],
    modules: ['modules/funnel'],
    templates: [],
    chartOptionsExtra: {
        series: [{
            type: 'funnel',
            name: 'Visitors',
            data: [
                ['Website visits', 15654],
                ['Downloads', 4064],
                ['Requested price list', 1987],
                ['Invoice sent', 976],
                ['Finalized', 846]
            ]
        }]
    }
} satisfies SampleGeneratorConfig;
