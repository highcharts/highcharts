Highcharts.chart('container', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        maxPadding: 0.1
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4,
            194.1, 95.6, 54.4],
        id: 'dataseries'
    }, {
        type: 'flags',
        onSeries: 'dataseries',
        data: [{
            x: 0,
            text: 'Dryest month of the year',
            title: 'I'
        }, {
            x: 8,
            text: 'Rainiest month of the year',
            title: 'I'
        }],
        width: 16,
        showInLegend: false
    }]
});