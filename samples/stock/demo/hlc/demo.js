Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlc.json', function (data) {

    // create the chart
    Highcharts.stockChart('container', {


        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            type: 'hlc',
            name: 'AAPL Stock Price',
            useOhlcData: true,
            data: data
        }]
    });
});
