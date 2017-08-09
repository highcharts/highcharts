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

    legend: {
        enabled: false
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

    series: [{
        name: 'Items bought',
        data: [5, 3, 4],
        borderWidth: 0
    }]

});
