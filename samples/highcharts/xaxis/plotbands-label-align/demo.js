Highcharts.chart('container', {
    xAxis: {
        plotBands: [{ // mark the weekend
            color: '#FCFFC5',
            from: '2010-01-02',
            to: '2010-01-04',
            label: {
                text: 'Plot band',
                align: 'right',
                x: -10
            }
        }],
        tickInterval: 24 * 3600 * 1000, // one day
        type: 'datetime'
    },

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
        pointStart: '2010-01-01',
        pointInterval: 24 * 3600 * 1000
    }]
});