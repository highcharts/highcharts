Highcharts.chart('container', {
    xAxis: {
        tickmarkPlacement: 'on',
        type: 'datetime',
        labels: {
            align: 'left',
            rotation: 0
        },
        gridLineWidth: 1,
        tickInterval: 24 * 3600 * 1000
    },
    plotOptions: {
        column: {
            pointPlacement: 'between'
        }
    },
    tooltip: {
        shared: true
    },
    series: [{

        name: 'Spot value at midnight',
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ],
        pointStart: '2012-01-01',
        pointInterval: 24 * 3600 * 1000
    }, {
        name: 'Daily average',
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ].reverse(),
        pointStart: '2012-01-01',
        pointInterval: 24 * 3600 * 1000,
        type: 'column'
    }]
});