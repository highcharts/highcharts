(async () => {

    // The same AAPL OHLC dataset used by the HLC and OHLC demos
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    // Four financial series types share the data, each in its own pane
    Highcharts.stockChart('container', {

        title: {
            text: 'Financial series legend symbols'
        },

        subtitle: {
            text: 'Candlestick, OHLC, HLC and hollow candlestick sharing ' +
                'the same AAPL data'
        },

        legend: {
            enabled: true
        },

        rangeSelector: {
            selected: 2
        },

        plotOptions: {
            series: {
                accessibility: {
                    point: {
                        valueDescriptionFormat: '{xDescription}. High: ' +
                            '{point.high}, low: {point.low}, close: ' +
                            '{point.close}.'
                    }
                }
            }
        },

        yAxis: [{
            height: '25%'
        }, {
            top: '25%',
            height: '25%'
        }, {
            top: '50%',
            height: '25%'
        }, {
            top: '75%',
            height: '25%'
        }],

        series: [{
            type: 'candlestick',
            name: 'AAPL',
            data: data,
            yAxis: 0
        }, {
            type: 'ohlc',
            name: 'AAPL',
            data: data,
            yAxis: 1
        }, {
            type: 'hlc',
            name: 'AAPL',
            useOhlcData: true,
            data: data,
            yAxis: 2
        }, {
            type: 'hollowcandlestick',
            name: 'AAPL',
            data: data,
            yAxis: 3
        }]
    });
})();
