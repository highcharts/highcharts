import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.minPadding',
        value: 0.25,
        min: 0,
        max: 0.5,
        step: 0.01
    }, {
        path: 'yAxis.startOnTick',
        value: false,
        inTitle: false
    }],
    templates: ['categories-12'],
    chartOptionsExtra: {
        yAxis: {
            lineWidth: 1
        },
        series: [{
            data: [
                129.9, 171.5, 206.4, 229.2, 244, 276, 235.6, 248.5, 316.4,
                294.1, 195.6, 154.4
            ]
        }]
    }
} satisfies SampleGeneratorConfig;