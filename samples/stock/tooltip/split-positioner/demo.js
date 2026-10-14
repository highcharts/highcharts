(async () => {

    // Load the dataset
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json());

    Highcharts.stockChart('container', {

        tooltip: {
            shape: 'square',
            header: {
                borderColor: 'var(--highcharts-neutral-color-40)',
                borderWidth: 1,
                shape: 'callout'
            },
            borderWidth: 0,
            shadow: false,
            /*
            Positioner callback. Note that this is much simpler since Highcharts
            v12.2, when the `tooltip.fixed` and `tooltip.position` options were
            introduced.
            */
            positioner: function (width, height, point) {
                const chart = this.chart,
                    series = point.series;
                let position;

                if (point.isHeader) {
                    position = {
                        x: Math.max(
                            // Left side limit
                            0,
                            Math.min(
                                point.plotX + chart.plotLeft - width / 2,
                                // Right side limit
                                chart.chartWidth - width - chart.marginRight
                            )
                        ),
                        y: chart.plotTop + point.plotY + 5
                    };
                } else {
                    position = {
                        x: series.chart.plotLeft,
                        y: series.yAxis.top +
                            series.yAxis.series.indexOf(series) * height + 3
                    };
                }

                return position;
            }
        },

        rangeSelector: {
            selected: 2
        },

        yAxis: [{
            height: '32%',
            resize: {
                enabled: true
            },
            labels: {
                align: 'right',
                x: -3
            },
            lineWidth: 2
        }, {
            top: '34%',
            height: '32%',
            labels: {
                align: 'right',
                x: -3
            },
            offset: 0,
            lineWidth: 2
        }, {
            top: '68%',
            height: '32%',
            labels: {
                align: 'right',
                x: -3
            },
            offset: 0,
            lineWidth: 2
        }],


        series: [{
            name: 'USD to EUR',
            type: 'candlestick',
            data: data,
            id: 'usdeur',
            tooltip: {
                pointFormat: '<span style="color:{point.color}">●</span>' +
                    '<b> {series.name} </b>' +
                    'Open: {point.open} ' +
                    'High: {point.high} ' +
                    'Low: {point.low} ' +
                    'Close: {point.close}'
            }
        }, {
            type: 'sma',
            linkedTo: 'usdeur'
        }, {
            type: 'atr',
            yAxis: 1,
            linkedTo: 'usdeur'
        }, {
            type: 'macd',
            yAxis: 2,
            linkedTo: 'usdeur',
            tooltip: {
                pointFormat: '<span style="color:{point.color}">●</span>' +
                    '<b> {series.name} </b>' +
                    'Value: {point.MACD} ' +
                    'Signal: {point.signal} ' +
                    'Histogram: {point.y}'
            }
        }]
    });
})();