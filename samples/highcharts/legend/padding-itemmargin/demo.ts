Highcharts.chart('container', {
    title: {
        text: 'Demo of legend padding and item margins'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    legend: {
        align: 'right',
        borderWidth: 1,
        itemMarginBottom: 5,
        itemMarginTop: 5,
        layout: 'vertical',
        padding: 8,
        verticalAlign: 'middle'
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [5, 3, 4, 2]
    }, {
        data: [4, 2, 5, 3]
    }]
});
