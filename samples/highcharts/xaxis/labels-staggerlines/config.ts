import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.labels.staggerLines',
        value: 2,
        min: 0,
        max: 5
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        xAxis: {
            categories: [
                'January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'
            ]
        }
    }
} satisfies SampleGeneratorConfig;