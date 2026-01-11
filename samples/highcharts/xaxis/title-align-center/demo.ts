Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>xAxis.title.align</em> and <em>text</em>'
    },
    xAxis: {
        title: {
            align: 'middle',
            text: 'X-Axis Title'
        },
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    credits: {
        enabled: false
    },
    legend: {
        enabled: false
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
} satisfies Highcharts.Options);
