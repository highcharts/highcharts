(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {
        title: {
            text: 'Renko chart',
            align: 'left'
        },
        series: [{
            type: 'renko',
            name: 'Renko',
            data
        }]
    });

    Highcharts.stockChart('container2', {
        title: {
            text: 'Candlestick and Heikin Ashi series comparison.',
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
            data
        }, {
            type: 'heikinashi',
            name: 'Heikin Ashi',
            data,
            yAxis: 1,
            tooltip: {
                valueDecimals: 2
            }
        }]
    });

})();
