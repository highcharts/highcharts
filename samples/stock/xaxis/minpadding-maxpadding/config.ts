import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.minPadding',
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01
    }, {
        path: 'yAxis.startOnTick',
        value: true,
        inTitle: false
    }, {
        path: 'yAxis.maxPadding',
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01
    }, {
        path: 'yAxis.endOnTick',
        value: true,
        inTitle: false
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        yAxis: {
            lineWidth: 1,
            labels: {
                x: -3
            }
        }
    }
} satisfies SampleGeneratorConfig;