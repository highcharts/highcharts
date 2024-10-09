Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', function (data) {
    Highcharts.stockChart('container', {
        chart: {
            height: 800
        },
        title: {
            text: 'Point and Figure series'
        },
        series: [
            {
                type: 'pointandfigure',
                data: data
            }
        ]
    });
});