$.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {

        title: {
            text: 'AAPL Stock Price'
        },

        subtitle: {
            text: 'Demo of placing the range selector above the navigator'
        },

        rangeSelector: {
            floating: true,
            y: -65,
            verticalAlign: 'bottom'
        },

        navigator: {
            margin: 60
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


