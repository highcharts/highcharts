Highcharts.chart('container', {
    xAxis: {
        tickInterval: 24 * 3600 * 1000, // one day
        type: 'datetime',
        plotLines: [{
            color: 'red',
            width: 2,
            value: '2010-01-06',
            label: {
                text: 'Plot line',
                verticalAlign: 'bottom',
                textAlign: 'right',
                y: -10
            }
        }]
    },

    yAxis: {
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
        pointStart: '2010-01-01',
        pointInterval: 24 * 3600 * 1000
    }]
});