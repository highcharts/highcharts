
$.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {
    Highcharts.stockChart('container', {
        chart: {
            description: 'Chart shows Apple stock prices from mid 2008 to mid 2015. It shows steady growth with one significant peak lasting through most of 2012 before normalizing.'
        },

        title: {
            text: 'Apple Stock Price 2008 to 2015'
        },

        subtitle: {
            text: 'Accessible stock chart demo'
        },

        rangeSelector: {
            selected: 1
        },

        navigator: {
            series: {
                description: 'Overview series for navigation' // The navigator series could be confusing to screen reader users.
            }
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
