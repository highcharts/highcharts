Highcharts.chart('container', {

    title: {
        text: 'Highcharts linecap settings'
    },

    plotOptions: {
        series: {
            marker: {
                enabled: false
            },
            lineWidth: 15
        }
    },

    xAxis: {
        minPadding: 0.25,
        maxPadding: 0.25,
        minTickInterval: 1
    },

    series: [{
        name: 'linecap: round',
        data: [2, 5, 2, 3, 6],
        linecap: 'round' // default
    }, {
        name: 'linecap: square',
        data: [4, 7, 4, 5, 8],
        linecap: 'square'
    }]

});