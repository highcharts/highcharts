import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'yAxis.offset',
        value: 10,
        min: 0,
        max: 20
    }, {
        path: 'yAxis.opposite',
        value: false,
        inTitle: false
    }],
    dataFile: 'usdeur.json',
    templates: [],
    factory: 'stockChart',
    chartOptionsExtra: {
        yAxis: {
            labels: {
                x: -2
            },
            lineWidth: 1,
            tickLength: 5,
            tickWidth: 1
        }
    }
} satisfies SampleGeneratorConfig;