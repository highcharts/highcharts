Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Social Media Marketing has grown revenue by 27% in past 3 months'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct'
        ]
    },

    yAxis: {
        title: {
            text: ''
        },
        labels: {
            format: '{value}k $'
        }
    },

    series: [{
        name: 'Revenue',
        data: [21, 23, 25, 28, 24, 22, 22, 24, 26, 28]
    }]
});
