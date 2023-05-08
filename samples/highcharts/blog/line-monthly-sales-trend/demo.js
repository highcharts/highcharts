Highcharts.chart('container', {
    title: {
        text: 'Monthly Sales Trend (May-Aug)'
    },
    xAxis: {
        categories: ['May', 'June', 'July', 'Aug']
    },
    yAxis: {
        title: {
            text: ''
        }
    },
    series: [{
        name: 'Sales',
        data: [206, 216, 247, 330]
    }]
});
