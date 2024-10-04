Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', function (data) {
    Highcharts.stockChart('container', {
        chart: {
            height: 800
        },
        series: [
            {
                type: 'pointandfigure',
                data: data
            }
        ]
    });
});