
$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlc.json', function (data) {

    // create the chart
    Highcharts.stockChart('container', {


        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL Stock Price',
            data: data,
            dataGrouping: {
                units: [
                    [
                        'week', // unit name
                        [1] // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]
                ]
            }
        }]
    });
});
