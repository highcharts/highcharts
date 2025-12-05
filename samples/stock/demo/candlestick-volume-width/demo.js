/**
 * A custom plugin to add proportional variation, based on volume values,
 * to the width of candle sticks and column series types.
 * Works with:
 * Candlestick, HollowCandlestick, Heikin Aishi, and Column series types.
 */
(function (H) {
    H.addEvent(
        H.seriesTypes.column,
        'afterColumnTranslate',
        function () {
            const series = this;

            if (
                series.options.baseVolume &&
                series.is('column') &&
                series.points
            ) {
                const volumeSeries =
                    series.chart.get(series.options.baseVolume);
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
        }
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
        dataLength = data.length;
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
            color: data[i][4] > previousCandleClose ? '#466742' : '#a23f43'
        });
        previousCandleClose = data[i][4];
    }

    Highcharts.stockChart('container', {

        plotOptions: {
            series: {
                dataGrouping: {
                    units: [
                        [
                            'week', // unit name
                            [1] // allowed multiples
                        ], [
                            'month',
                            [1, 2, 3, 4, 6]
                        ]
                    ]
                },
                groupPadding: 0,
                pointPadding: 0
            }
        },

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
            fixed: true
        },
        series: [{
            type: 'hollowcandlestick',
            id: 'aapl-ohlc',
            name: 'AAPL Stock Price',
            data: ohlc,
            baseVolume: 'aapl-volume'

        }, {
            type: 'column',
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
