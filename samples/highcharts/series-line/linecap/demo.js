Highcharts.chart('container', {

    plotOptions: {
        series: {
            marker: {
                enabled: false
            },
            lineWidth: 15
        }
    },

    xAxis: {
        min: -1,
        max: 5
    },

    series: [{
        data: [2, 5, 2, 3, 6],
        linecap: 'round' // default
    }, {
        data: [3, 6, 3, 4, 7],
        linecap: 'square'
    }]

});