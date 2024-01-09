Highcharts.chart('container', {
    series: [{
        type: 'column',
        data: [
            [Date.UTC(2024, 0, 1), 0.1],
            [Date.UTC(2024, 0, 2), 0.7],
            [Date.UTC(2024, 0, 3), 0.3],
            [Date.UTC(2024, 0, 4), 0.9]
        ],
        pointRange: 24 * 36e5,
        pointPlacement: 'between'
    }, {
        data: new Array(4 * 24).fill(1).map(Math.random),
        pointStart: Date.UTC(2024, 0, 1),
        pointInterval: 36e5
    }],

    xAxis: {
        type: 'datetime'
    }
});