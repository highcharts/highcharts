$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlcv.json', function (data) {
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
        chart: {
            borderWidth: 1
        },
        title: {
            text: 'Volume By Price (VBP)'
        },
        legend: {
            enabled: true
        },
        yAxis: [{
            height: '60%'
        }, {
            top: '65%',
            height: '35%',
            offset: 0
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
            id: 'volume',
            name: 'Volume',
            data: volume,
            yAxis: 1
        }, {
            type: 'vbp',
            linkedTo: 'AAPL',
            showInLegend: true
        }]
    });
});