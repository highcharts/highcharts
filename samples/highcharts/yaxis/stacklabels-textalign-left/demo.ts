Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Demo of <em>yAxis.stackLabels.textAlign</em> and <em>align</em>'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        stackLabels: {
            align: 'center',
            enabled: true,
            textAlign: 'left'
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2]
    }, {
        data: [144, 176, 135.6, 148.5]
    }]
} satisfies Highcharts.Options);
