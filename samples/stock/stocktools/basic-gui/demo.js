Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-c.json', function (data) {
    // Create the chart
    Highcharts.stockChart('container', {
        navigation: {
            bindingsClassName: 'tools-container' // informs Stock Tools where to look for HTML elements for adding technical indicators, annotations etc.
        },

        stockTools: {
            gui: {
                enabled: false // disable the built-in toolbar
            }
        },

        series: [{
            id: 'aapl',
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
});
