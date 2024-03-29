Highcharts.chart('container', {
    chart: {
        styledMode: true
    },

    title: {
        text: 'Title styles ...'
    },

    subtitle: {
        text: '... and subtitle styles ...'
    },

    caption: {
        text: '... and this is the green caption text'
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },

    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ],
        type: 'column'
    }]
});