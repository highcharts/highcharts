(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price'
        },

        tooltip: {
            valueDecimals: 2,
            valueSuffix: ' USD'
        },

        series: [{
            name: 'AAPL Stock Price',
            id: 'aapl',
            data: data,
            lineWidth: 0,
            marker: {
                enabled: true,
                radius: 2
            },
            states: {
                hover: {
                    lineWidthPlus: 0
                }
            }
        }, {
            type: 'trendline',
            linkedTo: 'aapl',
            marker: {
                enabled: false
            }
        }]
    });
})();