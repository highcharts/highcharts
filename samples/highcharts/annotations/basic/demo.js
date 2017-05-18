Highcharts.chart('container', {
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    title: {
        text: 'Highcharts Annotations'
    },

    series: [{
        data: [{ y: 29.9, id: 'min' }, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, { y: 216.4, id: 'max' }, 194.1, 95.6, 54.4]
    }],

    annotations: [{
        labels: [{
            point: 'max',
            text: 'Max'
        }, {
            point: 'min',
            text: 'Min',
            backgroundColor: 'white'
        }]
    }]
});