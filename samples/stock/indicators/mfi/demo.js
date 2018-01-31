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


    // create the chart
    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Historical'
        },

        yAxis: [{
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'OHLC'
            },
            height: '33%',
            lineWidth: 2
        }, {
            labels: {
                align: 'right',
                x: -3
            },
            title: {
                text: 'Volume'
            },
            top: '33%',
            height: '33%',
            offset: 0,
            lineWidth: 2
        }, {
            title: {
                text: 'MFI'
            },
            offset: 0,
            top: '66%',
            height: '34%',
            lineWidth: 2
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
            type: 'mfi',
            linkedTo: 'aapl',
            yAxis: 2,
            decimals: 4,
            marker: {
                enabled: false
            },
            params: {
                period: 14
            }
        }]
    });
});

