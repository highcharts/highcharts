
Highcharts.chart('container', {
    chart: {
        marginBottom: 70
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    subtitle: {
        text: '* Footnote is using verticalAlign: bottom',
        floating: true,
        align: 'right',
        x: -10,
        verticalAlign: 'bottom',
        y: -75
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
    }]
});