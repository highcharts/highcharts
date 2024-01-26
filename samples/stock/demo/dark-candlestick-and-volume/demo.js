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
                color: '#cccccc'
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
                color: '#cdcdc9'
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
                color: '#ea3d3d',
                upColor: '#47964e',
                upLineColor: '#47964e',
                lineColor: '#ea3d3d'
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
                valueDecimals: 2,
                pointFormat: '<b>O</b> <span style="color: {point.color}">{point.open} </span>' +
                    '<b>H</b> <span style="color: {point.color}">{point.high}</span><br/>' +
                    '<b>L</b> <span style="color: {point.color}">{point.low} </span>' +
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
