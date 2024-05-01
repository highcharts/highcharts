(async () => {
    // Load the dataset
    const colorTemplate =
        '{#ge point.open point.close}#ff6e6e{else}#51af7b{/ge}';
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
            data[i][1] < data[i][4] ?
                'highcharts-point-up' :
                'highcharts-point-down' // the volume
        ]);
    }

    Highcharts.stockChart('container', {
        lang: {
            accessibility: {
                defaultChartTitle: 'AAPL Stock Price'
            }
        },
        xAxis: {
            crosshair: {
                className: 'highcharts-crosshair-custom',
                enabled: true
            }
        },
        yAxis: [{
            title: {
                text: 'price (USD)'
            },
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
            title: {
                text: 'volume'
            },
            crosshair: {
                className: 'highcharts-crosshair-custom',
                snap: false,
                enabled: true,
                label: {
                    format:
                        '{#if value ge 1000000} {(divide value 1000000):.2f} ' +
                        'M {else} {value} {/if}',
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
            shadow: false,
            format: `<span style="font-size: 1.4em">{point.series.name}</span>
O<span style="color:${colorTemplate}";>{point.open}</span>
H<span style="color:${colorTemplate}";>{point.high}</span>
L<span style="color:${colorTemplate}";>{point.low}</span>
C<span style="color:${colorTemplate}";>{point.close}
{(subtract point.open point.close):.2f}
{(multiply (divide (subtract point.open point.close) point.close) 100):.2f}%
</span>
<br>
Volume<span style="color:${colorTemplate}";>{points.1.y}</span>`,
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
                    format: '{#if value ge 1000000} ' +
                        '{(divide value 1000000):.2f} M {else} {value} {/if}',
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
