(async () => {

    // Load the dataset
    const data = await fetch(
        'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/new-intraday.json'
    ).then(response => response.json());

    // create the chart
    Highcharts.stockChart('container', {

        title: {
            text: 'AAPL stock price by minute'
        },

        rangeSelector: {
            buttons: [{
                type: 'hour',
                count: 1,
                text: '1h'
            }, {
                type: 'day',
                count: 1,
                text: '1D'
            }, {
                type: 'all',
                count: 1,
                text: 'All'
            }],
            selected: 1,
            inputEnabled: false
        },

        series: [{
            name: 'AAPL',
            type: 'candlestick',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });
})();