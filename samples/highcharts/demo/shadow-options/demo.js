Highcharts.chart('container', {
    chart: {
        backgroundColor: null
    },

    title: {
        style: {
            color: '#CCC'
        }
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        labels: {
            style: {
                color: '#CCC'
            }
        },
        gridLineColor: '#333'

    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6,
            148.5, 216.4, 194.1, 95.6, 54.4],
        color: 'blue',
        shadow: {
            color: 'blue',
            width: 10,
            offsetX: 0,
            offsetY: 0
        }

    }, {
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6,
            148.5, 216.4, 194.1, 95.6, 54.4].reverse(),
        color: 'yellow',
        shadow: {
            color: 'yellow',
            width: 10,
            offsetX: 0,
            offsetY: 0
        }

    }]

});
