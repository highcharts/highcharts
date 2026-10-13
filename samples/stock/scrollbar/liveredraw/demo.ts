(async () => {

    const data = await fetch(
        'https://www.highcharts.com/samples/data/aapl-ohlc.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'AAPL Stock Price'
        },
        rangeSelector: {
            selected: 1
        },
        scrollbar: {
            liveRedraw: false
        },
        series: [{
            data: data,
            name: 'AAPL Stock Price',
            type: 'candlestick'
        }]
    });

})();
