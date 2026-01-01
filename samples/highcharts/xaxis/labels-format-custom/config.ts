import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.labels.format',
        value: '{value}'
    }, {
        path: 'yAxis.labels.format',
        value: '${value:.2f} USD'
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        chart: {
            type: 'column'
        }
    }
} satisfies SampleGeneratorConfig;