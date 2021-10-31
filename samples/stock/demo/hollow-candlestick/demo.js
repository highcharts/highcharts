Highcharts.getJSON(
    'https://demo-live-data.highcharts.com/aapl-ohlcv.json',
    function (data) {
        Highcharts.stockChart('container', {
            rangeSelector: {
                selected: 1
            },
            navigator: {
                series: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            series: [
                {
                    type: 'hollowcandlestick',
                    name: 'Hollow Candlestick',
                    data: data
                }
            ]
        });
    }
);
