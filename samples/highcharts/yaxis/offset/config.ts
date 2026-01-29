import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'xAxis.offset',
        value: 10,
        min: -50,
        max: 50
    }, {
        path: 'yAxis.offset',
        value: 10,
        min: -50,
        max: 50
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        yAxis: {
            lineWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;