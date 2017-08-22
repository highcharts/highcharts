Highcharts.chart('container', {

    chart: {
        type: 'item'
    },

    title: {
        text: 'Highcharts item chart'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        gridLineWidth: 0,
        labels: {
            enabled: false
        },
        title: {
            text: null
        }
    },

    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },

    series: [{
        name: 'Items bought',
        data: [5, 3, 4],
        color: 'green'
    }, {
        name: 'Items sold',
        data: [0, 2, 1],
        color: 'red'
    }]

});
