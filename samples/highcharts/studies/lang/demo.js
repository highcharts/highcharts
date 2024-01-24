Highcharts.chart('container', {
    accessibility: {
        enabled: true
    },
    xAxis: {
        type: 'datetime'
    },

    series: [
        {
            data: [
                [Date.UTC(2019, 0, 1), 1],
                [Date.UTC(2019, 1, 1), 1],
                [Date.UTC(2019, 2, 1), 1],
                [Date.UTC(2019, 3, 1), 1],
                [Date.UTC(2019, 4, 1), 1]
            ]
        },
        {
            type: 'pie',
            data: [
                1,
                { name: 'test', y: 4 },
                5
            ]
        }
    ]
});
