(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    var ohlc = [],
        volume = [];

    data.forEach(function (point) {
        ohlc.push([
            point[0],
            point[1],
            point[2],
            point[3],
            point[4]
        ]);
        volume.push([
            point[0],
            point[5]
        ]);
    });

    Highcharts.stockChart('container', {
        title: {
            text: 'Klinger Oscillator'
        },
        legend: {
            enabled: true
        },
        yAxis: [{
            height: '60%'
        }, {
            height: '20%',
            top: '60%'
        }, {
            height: '20%',
            top: '80%'
        }],
        series: [{
            type: 'candlestick',
            id: 'AAPL',
            name: 'AAPL',
            data: ohlc,
            tooltip: {
                valueDecimals: 2
            }
        }, {
            type: 'column',
            id: 'vol',
            name: 'Volume',
            data: volume,
            yAxis: 1
        }, {
            type: 'klinger',
            linkedTo: 'AAPL',
            showInLegend: true,
            params: {
                volumeSeriesID: 'vol'
            },
            yAxis: 2
        }]
    });
})();