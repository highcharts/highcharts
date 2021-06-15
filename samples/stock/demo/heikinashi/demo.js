Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-ohlcv.json', function (data) {
    var ohlc = [],
        dataLength = data.length,
        i = 0;

    for (i; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);
    }

    Highcharts.stockChart('container', {
        title: {
            text: 'Candlestick and Heiken Ashi series comparison.'
        },
        yAxis: [{
            title: {
                text: 'OHLC'
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
            data: ohlc
        }, {
            type: 'heikinashi',
            name: 'Heikin Ashi',
            data: ohlc,
            yAxis: 1
        }]
    });
});
