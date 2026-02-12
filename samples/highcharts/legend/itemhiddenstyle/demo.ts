Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend.itemHiddenStyle.color</em>'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    legend: {
        itemHiddenStyle: {
            color: '#80808080'
        }
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [5, 3, 4, 2],
        visible: false
    }, {
        data: [4, 2, 5, 3],
        visible: false
    }]
});
