Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    xAxis: {
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000
    },

    title: {
        text: 'One point per day'
    },

    plotOptions: {
        series: {
        }
    },

    series: [{
        data: [{
            x: '2012-01-01',
            y: 1
        }, {
            x: '2012-01-08',
            y: 3
        }, {
            x: '2012-01-15',
            y: 2
        }, {
            x: '2012-01-22',
            y: 4
        }],
        pointRange: 24 * 3600 * 1000
    }]
});