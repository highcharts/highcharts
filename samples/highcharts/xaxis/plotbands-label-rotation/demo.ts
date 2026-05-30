Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>xAxis.plotBands.label.rotation</em>'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ],
        plotBands: [{
            color: '#00c00040',
            from: 2.5,
            label: {
                rotation: 90,
                text: 'Plot band',
                textAlign: 'left'
            },
            to: 4.5
        }]
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});
