(async () => {
    const ohlc = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        series: [{
            type: 'ohlc',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: ohlc
        }]
    });
})();
