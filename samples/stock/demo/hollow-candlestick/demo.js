(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'AAPL Stock Price'
        },
        rangeSelector: {
            selected: 1
        },
        navigator: {
            series: {
                color: 'var(--highcharts-color-0)'
            }
        },
        series: [{
            type: 'hollowcandlestick',
            name: 'Hollow Candlestick',
            data: data
        }]
    });
})();