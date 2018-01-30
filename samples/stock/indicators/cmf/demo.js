$.getJSON('https://www.highcharts.com/samples/data/aapl-ohlcv.json', function (data) {

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


    // create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Historical'
        },

        legend: {
            enabled: true
        },

        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '60%',
            lineWidth: 2
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '65%',
            height: '35%',
            offset: 0,
            lineWidth: 2
        }, {
            visible: false,
            height: '60%'
        }],

        tooltip: {
            split: true
        },

        series: [{
            type: 'candlestick',
            id: 'aapl',
            name: 'AAPL',
            data: ohlc
        }, {
            type: 'column',
            id: 'volume',
            name: 'Volume',
            data: volume,
            yAxis: 1
        }, {
            type: 'cmf',
            linkedTo: 'aapl',
            yAxis: 2,
            marker: {
                enabled: false
            }
        }, {
            type: 'cmf',
            linkedTo: 'aapl',
            yAxis: 2,
            marker: {
                enabled: false
            },
            params: {
                period: 50
            }
        }]
    });
});
