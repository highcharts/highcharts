Highcharts.stockChart('container', {
    chart: {
        styledMode: true
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        type: 'hollowcandlestick',
        name: 'USD to EUR',
        data: ohlcdata
    }]
});
