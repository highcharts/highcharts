import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.labels.align',
        value: 'left'
    }],
    chartOptionsExtra: {
        xAxis: {
            labels: {
                format: 'Category {value}'
            },
            tickWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;