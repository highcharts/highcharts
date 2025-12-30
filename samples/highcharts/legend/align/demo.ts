Highcharts.chart('container', {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Demo of <em>legend</em> options'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    legend: {
        align: 'right',
        layout: 'vertical',
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
