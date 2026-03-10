import type {
    SampleGeneratorConfig
} from '../../../../tools/sample-generator/generator-config.d.ts';

export default {
    controls: [{
        path: 'scrollbar.liveRedraw',
        value: false
    }],
    dataFile: 'aapl-ohlc.json',
    factory: 'stockChart',
    templates: [],
    chartOptionsExtra: {
        rangeSelector: {
            selected: 1
        },
        title: {
            text: 'AAPL Stock Price'
        },
        series: [{
            type: 'candlestick',
            name: 'AAPL Stock Price'
        }]
    }
} satisfies SampleGeneratorConfig;
