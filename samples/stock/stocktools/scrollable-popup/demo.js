Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-ohlcv.json', function (data) {
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
        mapNavigation: {
            enabled: true
        },
        stockTools: {
            gui: {
                enabled: true,
                buttons: ['indicators']
            }
        },
        series: [{
            type: 'ohlc',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: ohlc
        }]
    });
});
