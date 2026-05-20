import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'series[0].markerUp.lineColor'
    }, {
        path: 'series[0].marker.lineColor'
    }, {
        path: 'series[0].boxSize',
        min: 1,
        max: 16
    }, {
        path: 'series[0].reversalAmount',
        min: 1,
        max: 16
    }],
    dataFile: 'aapl-c.json',
    templates: [],
    factory: 'stockChart',
    modules: ['modules/pointandfigure'],
    chartOptionsExtra: {
        chart: {
            height: 800
        },
        title: {
            text: 'Point and Figure series'
        },
        rangeSelector: {
            selected: 5
        },
        series: [{
            type: 'pointandfigure',
            boxSize: 3,
            reversalAmount: 2
        }]
    }
} satisfies SampleGeneratorConfig;