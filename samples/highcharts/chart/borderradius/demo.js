Highcharts.chart('container', {
    chart: {
        borderColor: '#EBBA95',
        borderRadius: 20,
        borderWidth: 2,
        type: 'line'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec']
    },
    legend: {
        layout: 'vertical',
        backgroundColor: '#FFFFFF',
        floating: true,
        align: 'left',
        x: 100,
        verticalAlign: 'top',
        y: 70
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