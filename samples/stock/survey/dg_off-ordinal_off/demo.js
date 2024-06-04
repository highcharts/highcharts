Highcharts.getJSON('https://cdn.jsdelivr.net/gh/highcharts/highcharts/samples/data/new-intraday.json', function (data) {
    Highcharts.stockChart('container', {
        series: [{
            type: 'candlestick',
            data: data,
            dataGrouping: {
                enabled: false
            }
        }],

        xAxis: {
            ordinal: false
        }
    });
});
