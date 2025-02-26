Highcharts.chart('container', {
    chart: {
        type: 'column'
    },

    title: {
        text: 'Linked axes'
    },

    xAxis: [{ // primary axis
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000
    }, { // linked axis
        type: 'datetime',
        linkedTo: 0,
        opposite: true,
        tickInterval: 24 * 3600 * 1000,
        labels: {
            format: '{value:%a}'
        }
    }],

    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
        pointStart: '2010-01-01',
        pointInterval: 24 * 3600 * 1000 // one day
    }]
});