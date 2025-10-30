(function (H) {
    function volumeBasedWidthResizer(proceed, ...args) {
        const ret = proceed.apply(this, args),
            series = this;

        if (series.options.baseVolume && series.is('column') && series.points) {
            const volumeSeries = series.chart.get(series.options.baseVolume);
            const processedYData = volumeSeries.getColumn('y', true);
            if (volumeSeries && processedYData) {
                const maxVolume = volumeSeries.dataMax,
                    metrics = series.getColumnMetrics(),
                    baseWidth = metrics.width;

                series.points.forEach((point, i) => {
                    const volume = processedYData[i];
                    const scale = volume / maxVolume;
                    const width = baseWidth * scale;

                    if (point.shapeArgs) {
                        point.shapeArgs.x = point.shapeArgs.x - width /
                            2 + point.shapeArgs.width / 2;
                        point.shapeArgs.width = width;
                    }
                });
            }
        }

        return ret;
    }

    H.wrap(
        H.seriesTypes.column.prototype,
        'translate',
        volumeBasedWidthResizer
    );

    H.wrap(
        H.seriesTypes.candlestick.prototype,
        'translate',
        volumeBasedWidthResizer
    );
}(Highcharts));

(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlcv.json'
    ).then(response => response.json());

    // split the data set into ohlc and volume
    const ohlc = [],
        volume = [],
        dataLength = data.length,
        dataGrouping = {
            units: [
                [
                    'week', // unit name
                    [1] // allowed multiples
                ], [
                    'month',
                    [1, 2, 3, 4, 6]
                ]
            ]
        };
    let previousCandleClose = 0;

    for (let i = 0; i < dataLength; i += 1) {
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
            color: data[i][4] > previousCandleClose ? '#466742' : '#a23f43',
            labelColor: data[i][4] > previousCandleClose ? '#51a958' : '#ea3d3d'
        });
        previousCandleClose = data[i][4];
    }

    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 4
        },

        navigator: {
            enabled: false
        },

        yAxis: [{
            labels: {
                align: 'left'
            },
            height: '80%',
            resize: {
                enabled: true
            }
        }, {
            labels: {
                align: 'left'
            },
            top: '80%',
            height: '20%',
            offset: 0
        }],
        tooltip: {
            shape: 'square',
            headerShape: 'callout',
            borderWidth: 0,
            shadow: false,
            positioner: function (width, height, point) {
                const chart = this.chart;
                let position;

                if (point.isHeader) {
                    position = {
                        x: Math.max(
                            // Left side limit
                            chart.plotLeft,
                            Math.min(
                                point.plotX + chart.plotLeft - width / 2,
                                // Right side limit
                                chart.chartWidth - width - chart.marginRight
                            )
                        ),
                        y: point.plotY
                    };
                } else {
                    position = {
                        x: point.series.chart.plotLeft,
                        y: point.series.yAxis.top - chart.plotTop
                    };
                }

                return position;
            }
        },
        series: [{
            type: 'hollowcandlestick',
            dataGrouping,
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: ohlc,
            baseVolume: 'aapl-volume'

        }, {
            type: 'column',
            dataGrouping,
            id: 'aapl-volume',
            name: 'AAPL Volume',
            data: volume,
            yAxis: 1,
            baseVolume: 'aapl-volume',
            borderRadius: 0
        }],
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
