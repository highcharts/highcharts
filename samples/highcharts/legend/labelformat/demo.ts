Highcharts.chart('container', {
    title: {
        text: 'Demo of <em>legend.labelFormat</em>'
    },
    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ]
    },
    legend: {
        align: 'right',
        labelFormat: '{name} <small>(Click to hide)</small>',
        layout: 'proximate'
    },
    series: [{
        data: [1, 3, 2, 4]
    }, {
        data: [5, 3, 4, 2]
    }, {
        data: [4, 2, 5, 3]
    }]
});
