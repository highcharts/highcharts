Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', function (data) {

    // Create the chart
    Highcharts.stockChart('container', {


        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        scrollbar: {
            enabled: false
        },

        series: [{
            name: 'AAPL Stock Price',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});
