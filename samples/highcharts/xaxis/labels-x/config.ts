import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.labels.x',
        value: 0,
        min: -20,
        max: 20
    }, {
        path: 'yAxis.labels.y',
        value: -2,
        min: -20,
        max: 20
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        yAxis: {
            labels: {
                align: 'left'
            }
        }
    }
} satisfies SampleGeneratorConfig;