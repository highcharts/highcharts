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

        series: [{
            name: 'AAPL Stock Price',
            data: data,
            lineWidth: 0,
            marker: {
                enabled: true,
                radius: 2
            },
            tooltip: {
                valueDecimals: 2
            },
            states: {
                hover: {
                    lineWidthPlus: 0
                }
            }
        }]
    });
})();