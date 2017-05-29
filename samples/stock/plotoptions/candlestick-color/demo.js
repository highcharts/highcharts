
Highcharts.stockChart('container', {

    plotOptions: {
        candlestick: {
            color: 'blue',
            upColor: 'red'
        }
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        type: 'candlestick',
        name: 'USD to EUR',
        data: ohlcdata
    }]
});