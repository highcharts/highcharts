(async () => {

    // The same AAPL OHLC dataset used by the HLC and OHLC demos
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        title: {
            text: 'Financial series legend symbols'
        },

        subtitle: {
            text: 'Candlestick, OHLC, HLC, hollow candlestick and Heikin ' +
                'Ashi sharing the same AAPL data'
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
                        // Heikin Ashi values are computed, so round them
                        valueDescriptionFormat: '{xDescription}. Open: ' +
                            '{point.open:.2f}, high: {point.high:.2f}, low: ' +
                            '{point.low:.2f}, close: {point.close:.2f}.'
                    }
                }
            }
        },

        yAxis: [{
            height: '20%'
        }, {
            top: '20%',
            height: '20%'
        }, {
            top: '40%',
            height: '20%'
        }, {
            top: '60%',
            height: '20%'
        }, {
            top: '80%',
            height: '20%'
        }],

        series: [{
            type: 'candlestick',
            name: 'Candlestick',
            data: data,
            yAxis: 0
        }, {
            type: 'ohlc',
            name: 'OHLC',
            data: data,
            yAxis: 1
        }, {
            type: 'hlc',
            name: 'HLC',
            useOhlcData: true,
            data: data,
            yAxis: 2
        }, {
            type: 'hollowcandlestick',
            name: 'Hollow Candlestick',
            data: data,
            yAxis: 3
        }, {
            type: 'heikinashi',
            name: 'Heikin Ashi',
            data: data,
            yAxis: 4
        }]
    });
})();
