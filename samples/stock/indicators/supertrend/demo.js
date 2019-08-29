Highcharts.getJSON('https://www.highcharts.com/samples/data/aapl-ohlcv.json', function (data) {

    Highcharts.stockChart('container', {

        rangeSelector: {
            selected: 1
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

        series: [{
            type: 'candlestick',
            id: 'aapl',
            name: 'AAPL Stock Price',
            data: data
        }, {
            type: 'supertrend',
            linkedTo: 'aapl',
            lineWidth: 2,
            marker: {
                enabled: false
            },
            risingTrendColor: '#16C535',
            fallingTrendColor: '#F22303',
            changeTrendLine: {
                styles: {
                    lineWidth: 0.5,
                    lineColor: '#000',
                    dashStyle: 'Dash'
                }
            }
        }]

    });

});
