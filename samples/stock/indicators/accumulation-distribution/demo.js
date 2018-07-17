
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

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 2
        },

        title: {
            text: 'AAPL Stock Price'
        },

        legend: {
            enabled: true
        },

        plotOptions: {
            series: {
                showInLegend: true
            }
        },

        yAxis: [{
            height: '30%'
        }, {
            top: '40%',
            height: '20%'
        }, {
            top: '80%',
            height: '20%'
        }],

        series: [{
            type: 'ohlc',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: ohlc
        }, {
            data: volume,
            yAxis: 1,
            name: 'Volume',
            id: 'volume',
            type: 'column'
        }, {
            type: 'ad',
            linkedTo: 'aapl',
            yAxis: 2,
            params: {
                period: 0,
                volumeSeriesID: 'volume'
            }
        }]
    });
});
