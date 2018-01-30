
$.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {

    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            name: 'AAPL Stock Price',
            data: data,
            step: true,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});