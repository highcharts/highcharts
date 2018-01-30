$.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            buttonTheme: {
                width: 120
            },
            buttons: [{
                type: 'ytd',
                count: 1,
                text: 'YTD - 31 of Dec',
                offsetMin: -24 * 3600 * 1000
            }, {
                type: 'ytd',
                count: 1,
                text: 'YTD - 1st of Jan',
                offsetMax: 0 // default
            }, {
                type: 'all',
                text: 'All'
            }]
        },
        xAxis: {
            ordinal: false
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


