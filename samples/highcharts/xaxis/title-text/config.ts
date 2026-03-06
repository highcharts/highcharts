import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.title.text',
        value: 'Custom with <b>simple</b> <i>markup</i>'
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        legend: {
            align: 'right',
            verticalAlign: 'middle',
            layout: 'vertical'
        }
    }
} satisfies SampleGeneratorConfig;