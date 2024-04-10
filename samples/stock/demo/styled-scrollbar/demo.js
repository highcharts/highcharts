(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-c.json'
    ).then(response => response.json());

    // Create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        subtitle: {
            text: 'Stock chart with scrollbar styling'
        },

        scrollbar: {
            barBorderRadius: 0,
            barBorderWidth: 1,
            buttonsEnabled: true,
            height: 14,
            margin: 0,
            rifleColor: '#333',
            trackBackgroundColor: '#f2f2f2',
            trackBorderRadius: 0
        },

        series: [{
            name: 'AAPL Stock Price',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
})();