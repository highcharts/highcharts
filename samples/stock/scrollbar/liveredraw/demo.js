(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    // create the chart
    Highcharts.stockChart('container', {

        scrollbar: {
            liveRedraw: false
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price'
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL Stock Price',
            data: data
        }]
    });
})();