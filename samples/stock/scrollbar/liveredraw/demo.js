
$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlc.json', function (data) {

    // create the chart
    Highcharts.stockChart('container', {

        scrollbar: {
            liveRedraw: false
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL Stock Price',
            data: data
        }]
    });
});
