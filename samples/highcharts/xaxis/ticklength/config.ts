import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'xAxis.tickLength',
        value: 30,
        min: 0,
        max: 40
    }, {
        path: 'yAxis.tickLength',
        value: 0,
        min: 0,
        max: 40
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        xAxis: {
            tickWidth: 1
        },
        yAxis: {
            lineWidth: 1,
            tickWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;