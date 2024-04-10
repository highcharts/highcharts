Highcharts.stockChart('container', {

    plotOptions: {
        candlestick: {
            color: 'pink',
            lineColor: 'red',
            upColor: 'lightgreen',
            upLineColor: 'green'
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