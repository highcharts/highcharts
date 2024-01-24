(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    // split the data set into ohlc and volume
    const ohlc = [],
        volume = [],
        dataLength = data.length;

    let previousCandleClose = 0;
    for (let i = 0; i < dataLength; i++) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push({
            x: data[i][0], // the date
            y: data[i][5], // the volume
            color: data[i][4] > previousCandleClose ? '#273a25' : '#4e1c1f'
        });
        previousCandleClose = data[i][4];
    }

    Highcharts.setOptions({
        chart: {
            backgroundColor: '#121211'
        },
        title: {
            style: {
                color: '#ccc'
            }
        },
        xAxis: {
            gridLineColor: '#181816'
        },
        yAxis: {
            gridLineColor: '#181816'
        },
        tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            style: {
                color: '#CDCDC9'
            }
        }
    });

    Highcharts.stockChart('container', {
        rangeSelector: {
            enabled: false
        },

        navigator: {
            enabled: false
        },

        title: {
            text: 'Candlestick and Volume'
        },

        plotOptions: {
            candlestick: {
                color: '#EA3D3D',
                upColor: '#47964E',
                upLineColor: '#47964E',
                lineColor: '#EA3D3D'
            }
        },

        legend: {
            enabled: false
        },

        xAxis: {
            gridLineWidth: 1,
            crosshair: {
                snap: false
            }
        },

        yAxis: [{
            height: '70%',
            crosshair: {
                snap: false
            }
        }, {
            top: '70%',
            height: '30%'
        }],

        tooltip: {
            shared: true,
            split: false,
            useHTML: true,
            shadow: false,
            positioner: function () {
                return { x: 10, y: 10 };
            }
        },

        series: [{
            type: 'candlestick',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: ohlc,
            tooltip: {
                pointFormat: '<b>O</b> <span style="color: {point.color}">{point.open}</span><br/>' +
                    '<b>H</b> <span style="color: {point.color}">{point.high}</span><br/>' +
                    '<b>L</b> <span style="color: {point.color}">{point.low}</span><br/>' +
                    '<b>C</b> <span style="color: {point.color}">{point.close}</span><br/>'
            }
        }, {
            type: 'column',
            name: 'Volume',
            data: volume,
            yAxis: 1,
            borderRadius: 0,
            groupPadding: 0,
            pointPadding: 0,
            tooltip: {
                pointFormat: '<b>Volume</b> {point.y}<br/>'
            }
        }]
    });
})();
