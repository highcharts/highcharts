
Highcharts.chart('container', {
    title: {
        text: 'Series cursor by CSS'
    },
    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    plotOptions: {
        series: {
            events: {
                click: function () {
                    alert('You just clicked the graph');
                }
            }
        }
    },

    series: [{
        data: [1, 3, 2, 4],
        type: 'column'
    }, {
        data: [5, 4, 6, 7],
        type: 'line',
        dataLabels: {
            enabled: true
        }
    }]
});