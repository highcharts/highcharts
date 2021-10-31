Highcharts.getJSON(
    'https://demo-live-data.highcharts.com/aapl-ohlcv.json',
    function (data) {
        Highcharts.stockChart('container', {
            title: {
                text: 'Candlestick and Heiken Ashi series comparison.'
            },
            rangeSelector: {
                selected: 1
            },
            yAxis: [
                {
                    title: {
                        text: 'Candlestick'
                    },
                    height: '50%'
                },
                {
                    title: {
                        text: 'Heikin Ashi'
                    },
                    top: '50%',
                    height: '50%',
                    offset: 0
                }
            ],
            series: [
                {
                    type: 'candlestick',
                    name: 'Candlestick',
                    data: data
                },
                {
                    type: 'heikinashi',
                    name: 'Heikin Ashi',
                    data: data,
                    yAxis: 1
                }
            ]
        });
    }
);
