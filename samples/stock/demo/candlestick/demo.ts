(async (): Promise<void> => {
    const data = await fetch(
        'https://demo-live-data.highcharts.com/aapl-ohlc.json'
    ).then(response => response.json()) as
        Highcharts.SeriesOptionsRegistry['SeriesOhlcOptions']['data'];

    // create the chart
    Highcharts.stockChart('container', {
        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'AAPL Stock Price',
            align: 'left'
        },

        subtitle: {
            text: 'Generated from Google Finance API',
            align: 'left'
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL Stock Price',
            data: data,
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
            }
        }],

        tooltip: {
            fixed: true
        },

        yAxis: {
            maxPadding: 0.25
        },

        scrollbar: {
            enabled: false
        },

        navigator: {
            height: 72,
            maskFill: 'rgba(44, 175, 254, 0.15)',
            series: {
                fillColor: {
                    linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                    stops: [
                        [0, 'rgba(0, 117, 219, 0.12)'],
                        [1, 'rgba(0, 113, 219, 0)']
                    ]
                }
            },
            xAxis: {
                lineWidth: 1,
                lineColor: 'var(--highcharts-neutral-color-40, #999)'
            },
            yAxis: {
                lineWidth: 1,
                lineColor: 'var(--highcharts-neutral-color-40, #999)'
            }
        }
    });
})().catch(console.error);