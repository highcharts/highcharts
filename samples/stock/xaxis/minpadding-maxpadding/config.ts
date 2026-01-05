import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minPadding',
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01
    }, {
        path: 'yAxis.startOnTick',
        value: true
    }, {
        path: 'yAxis.maxPadding',
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01
    }, {
        path: 'yAxis.endOnTick',
        value: true
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        title: {
            text: 'Demo of <em>yAxis.minPadding</em> and <em>maxPadding</em>'
        },
        yAxis: {
            lineWidth: 1,
            labels: {
                x: -3
            }
        }
    }
} satisfies SampleGeneratorConfig;