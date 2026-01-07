Highcharts.chart('container', {
    chart: {
        type: 'column',
        width: 320
    },
    title: {
        text: 'Demo of <em>yAxis.stackLabels.allowOverlap</em>'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: {
        stackLabels: {
            allowOverlap: false,
            enabled: true
        }
    },
    plotOptions: {
        column: {
            groupPadding: 0,
            pointPadding: 0,
            stacking: 'normal'
        }
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }, {
        data: [
            144, 176, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5,
            106.4, 129.2
        ]
    }]
} satisfies Highcharts.Options);
