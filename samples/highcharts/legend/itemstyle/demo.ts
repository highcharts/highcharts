Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend.itemStyle.color</em> and <em>fontWeight</em>'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    legend: {
        itemStyle: {
            color: '#2caffe',
            fontWeight: 'bold'
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
