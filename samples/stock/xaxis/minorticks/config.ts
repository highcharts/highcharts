import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/config.ts';

export default {
    controls: [{
        path: 'yAxis.minorTickColor',
        value: '#80808080'
    }, {
        path: 'yAxis.minorTickWidth',
        value: 1,
        min: 0,
        max: 5
    }, {
        path: 'yAxis.minorTickLength',
        value: 10,
        min: 0,
        max: 20
    }, {
        path: 'yAxis.minorTickPosition',
        value: 'inside'
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        title: {
            text: 'Demo of <em>yAxis.minorTicks</em>'
        },
        yAxis: {
            minorTicks: true,
            minorGridLineWidth: 0
        }
    }
} satisfies SampleGeneratorConfig;