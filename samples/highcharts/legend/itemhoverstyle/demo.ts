Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend.itemHoverStyle.color</em>'
    },
    subtitle: {
        text: 'Hover legend items to see the effect'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    legend: {
        itemHoverStyle: {
            color: '#2caffe'
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [5, 3, 4, 2]
    }, {
        data: [4, 2, 5, 3]
    }]
});
