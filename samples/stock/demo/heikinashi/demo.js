(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Candlestick and Heiken Ashi series comparison.',
            align: 'left'
        },
        rangeSelector: {
            selected: 1
        },
        yAxis: [{
            title: {
                text: 'Candlestick'
            },
            height: '50%'
        }, {
            title: {
                text: 'Heikin Ashi'
            },
            top: '50%',
            height: '50%',
            offset: 0
        }],
        series: [{
            type: 'candlestick',
            name: 'Candlestick',
            data: data
        }, {
            type: 'heikinashi',
            name: 'Heikin Ashi',
            data: data,
            yAxis: 1
        }]
    });
})();