Highcharts.chart('container', {

    chart: {
        type: 'item'
    },

    title: {
        text: 'Highcharts equalizer chart'
    },

    xAxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },

    yAxis: {
        allowDecimals: false
    },

    plotOptions: {
        series: {
            stacking: 'normal',
            marker: {
                symbol: 'rect',
                radius: 5
            }
        }
    },

    series: [{
        name: 'Items sold',
        data: [0, 2, 1, 3, 4, 2, 3, 1, 2, 3, 1, 1],
        color: 'red'
    }, {
        name: 'Items bought',
        data: [8, 7, 6, 9, 8, 5, 6, 4, 5, 7, 6, 8],
        color: 'green'
    }]

});
