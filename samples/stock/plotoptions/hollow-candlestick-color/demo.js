(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },
        navigator: {
            series: {
                color: Highcharts.getOptions().colors[0]
            }
        },
        series: [{
            type: 'hollowcandlestick',
            name: 'Hollow Candlestick',
            color: '#ff5e00',
            lineColor: '#ff5e00',
            upColor: '#35bd00',
            upLineColor: '#35bd00',
            data: data
        }]
    });
})();