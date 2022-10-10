Highcharts.chart('container', {
    chart: {
        defaultSeriesType: 'bar'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec']
    },
    legend: {
        layout: 'vertical',
        floating: true,
        backgroundColor: '#FFFFFF',
        align: 'right',
        verticalAlign: 'top',
        y: 60,
        x: -60
    },
    tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.category}: {point.y}'
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4]
    }]
});