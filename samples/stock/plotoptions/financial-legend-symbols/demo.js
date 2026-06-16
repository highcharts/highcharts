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
            height: '33%',
            offset: 0
        }, {
            top: '66%',
            height: '34%',
            offset: 0
        }],

        series: [{
            type: 'candlestick',
            name: 'AAPL',
            color: '#2caffe',
            data: data,
            yAxis: 0
        }, {
            type: 'ohlc',
            name: 'AAPL',
            color: '#544fc5',
            data: data,
            yAxis: 1
        }, {
            type: 'hlc',
            name: 'AAPL',
            color: '#00e272',
            useOhlcData: true,
            data: data,
            yAxis: 2
        }]
    });
})();
