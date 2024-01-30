(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    // split the data set into ohlc and volume
    const ohlc = [],
        volume = [],
        dataLength = data.length;

    for (let i = 0; i < dataLength; i += 1) {
        ohlc.push([
            data[i][0], // the date
            data[i][1], // open
            data[i][2], // high
            data[i][3], // low
            data[i][4] // close
        ]);

        volume.push([
            data[i][0], // the date
            data[i][5],
            data[i][1] < data[i][4] ? 'highcharts-point-up' : 'highcharts-point-down' // the volume
        ]);
    }

    Highcharts.stockChart('container', {
        xAxis: {
            gridLineWidth: 1,
            gridLineColor: 'black',
            crosshair: {
                className: 'highcharts-crosshair-custom',
                enabled: true
            }
        },
        yAxis: [{
            crosshair: {
                snap: false,
                className: 'highcharts-crosshair-custom',
                label: {
                    className: 'highcharts-crosshair-custom-label',
                    enabled: true,
                    format: '{value:.2f}'
                },
                enabled: true
            },
            labels: {
                align: 'left'
            },
            height: '70%'
        }, {
            crosshair: {
                className: 'highcharts-crosshair-custom',
                snap: false,
                enabled: true,
                label: {
                    formatter: function (value) {
                        return value > 10e6 ?
                            (value / 10e6).toFixed(2) + 'M' :
                            value > 10e3 ?
                                (value / 10e3).toFixed(2) + 'k' :
                                value;
                    },
                    className: 'highcharts-crosshair-custom-label',
                    enabled: true
                }
            },
            labels: {
                align: 'left'
            },
            top: '70%',
            height: '30%',
            offset: 0
        }],
        chart: {
            styledMode: true
        },
        tooltip: {
            shape: 'square',
            split: false,
            shared: true,
            headerShape: 'callout',
            borderWidth: 0,
            shadow: false,
            formatter: function () {

                const point = this.points[0].point;
                const color = point.open > point.close ? '#ff4242' : '#51af7b';
                // @eslint-ignore max-len
                return `<span style="font-size: 1.4em">  ${this.series.name}</span> O<span style="color: ${color}";>${point.open}</span> H<span style="color: ${color}";>${point.high}</span> L<span style="color: ${color}";>${point.low}</span> C<span style="color: ${color}";>${point.close}</span> <span style="color: ${color}";>${Math.floor(point.open - point.close)} (${Math.floor((point.open - point.close) / point.close * 100) / 100}%)</span><br>Volume <span style="color: ${color}";>${this.points[1].point.y}</span>`;
            },
            positioner: () => ({ x: 60, y: 0 })
        },
        series: [{
            type: 'candlestick',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            lastPrice: {
                enabled: true,
                label: {
                    enabled: true,
                    align: 'left',
                    x: 8
                }
            },
            data: ohlc
        }, {
            type: 'column',
            lastPrice: {
                enabled: true,
                label: {
                    formatter: function (value) {
                        return value > 10e6 ?
                            (value / 10e6).toFixed(2) + 'M' :
                            value > 10e3 ?
                                (value / 10e3).toFixed(2) + 'k' :
                                value;
                    },
                    enabled: true,
                    align: 'left',
                    x: 8
                }
            },
            keys: ['x', 'y', 'className'],
            id: 'aapl-volume',
            name: 'AAPL Volume',
            data: volume,
            yAxis: 1
        }],
        rangeSelector: {
            verticalAlign: 'bottom'
        },
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 800
                },
                chartOptions: {
                    rangeSelector: {
                        inputEnabled: false
                    }
                }
            }]
        }
    });
})();
