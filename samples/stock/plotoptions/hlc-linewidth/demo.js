Highcharts.stockChart('container', {

    title: {
        text: 'HLC series with line width 3'
    },

    plotOptions: {
        hlc: {
            lineWidth: 3
        }
    },

    rangeSelector: {
        selected: 1
    },

    series: [{
        type: 'hlc',
        name: 'USD to EUR',
        useOhlcData: true,
        data: ohlcdata
    }]
});