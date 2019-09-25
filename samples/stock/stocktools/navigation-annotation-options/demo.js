Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-ohlcv.json', function (data) {

    // split the data set into ohlc and volume
    var ohlc = [],
        volume = [],
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

        volume.push([
            data[i][0], // the date
            data[i][5] // the volume
        ]);
    }

    Highcharts.stockChart('container', {
        navigation: {
            bindings: {
                rect: {
                    annotationsOptions: {
                        shapeOptions: {
                            fill: 'rgba(255, 0, 0, 0.8)'
                        }
                    }
                }
            },
            annotationsOptions: {
                typeOptions: {
                    line: {
                        stroke: 'rgba(255, 0, 0, 1)',
                        strokeWidth: 10
                    }
                }
            }
        },
        yAxis: [{
            labels: {
                align: 'left'
            },
            height: '80%'
        }, {
            labels: {
                align: 'left'
            },
            top: '80%',
            height: '20%',
            offset: 0
        }],
        series: [{
            type: 'line',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: ohlc
        }, {
            type: 'column',
            id: 'aapl-volume',
            name: 'AAPL Volume',
            data: volume,
            yAxis: 1
        }]
    });
});
