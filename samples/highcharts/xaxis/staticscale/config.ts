import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.staticScale',
        value: 50
    }],
    modules: ['modules/static-scale'],
    chartOptionsExtra: {
        chart: {
            type: 'bar'
        }
    }
} satisfies SampleGeneratorConfig;