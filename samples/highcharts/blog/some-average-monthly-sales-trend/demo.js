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
        },
        plotLines: [{
            color: '#FF0000',
            width: 2,
            value: 22.3,
            zIndex: 5,
            dashStyle: 'longdashdot',
            label: {
                text: 'Average monhtly sales',
                y: -10,
                style: {
                    color: '#FF0000',
                    fontWeight: 'bold'
                }
            }

        }]
    },
    annotations: [{
        labels: [{
            point: {
                xAxis: 0,
                yAxis: 0,
                x: 7,
                y: 24
            },
            text: 'Start of a good growth'

        }]
    }],
    series: [{
        name: 'Revenue',
        data: [21, 23, 25, 28, 24, 22, 22, {
            y: 24,
            color: '#FF420E'
        }, {
            y: 26,
            color: '#FF420E'
        }, {
            y: 28,
            color: '#FF420E'
        }]
    }]
});
