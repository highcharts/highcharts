(async () => {

    // The same AAPL OHLC dataset used by the HLC and OHLC demos
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    // One chart, three financial series types sharing the data, each in its
    // own pane. The legend shows their distinct symbols side by side.
    Highcharts.stockChart('container', {

        title: {
            text: 'Financial series legend symbols'
        },

        subtitle: {
            text: 'Candlestick, OHLC and HLC sharing the same AAPL data'
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
            height: '33%'
        }, {
            top: '33%',
            height: '33%'
        }, {
            top: '66%',
            height: '34%'
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
        }]
    });
})();
