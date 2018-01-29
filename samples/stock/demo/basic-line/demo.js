

$.getJSON('https://cdn.rawgit.com/highcharts/highcharts/v6.0.4/samples/data/aapl-c.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {


        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});

