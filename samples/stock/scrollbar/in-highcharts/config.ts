import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'scrollbar.enabled',
        value: true
    }],
    templates: ['categories-12'],
    factory: 'chart',
    modules: ['modules/stock'],
    chartOptionsExtra: {
        xAxis: {
            min: 6
        },
        legend: {
            verticalAlign: 'top',
            align: 'right'
        }
    }
} satisfies SampleGeneratorConfig;
