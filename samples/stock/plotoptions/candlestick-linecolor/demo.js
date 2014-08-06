$(function () {
    $('#container').highcharts('StockChart', {

        plotOptions: {
            candlestick: {
                lineColor: '#2f7ed8',
                upLineColor: 'silver', // docs
                upColor: 'silver'
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
});