Highcharts.chart('container', {
    chart: {
        alignTicks: false
    },
    title: {
        text: 'Demo of <em>chart.alignTicks</em>'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    yAxis: [{
        title: {
            text: 'Primary Axis'
        },
        id: 'primary'
    }, {
        title: {
            text: 'Secondary Axis'
        },
        gridLineWidth: 0,
        id: 'secondary',
        opposite: true
    }],
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }, {
        yAxis: 'secondary',
        data: [
            129.9, 271.5, 306.4, 29.2, 544, 376, 435.6, 348.5, 216.4, 294.1,
            35.6, 354.4
        ]
    }]
});
