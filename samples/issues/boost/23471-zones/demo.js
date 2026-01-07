Highcharts.chart('container', {
    series: [
        {
            boostThreshold: 1,
            type: 'scatter',
            data: [
                [1, 1],
                [2, 1]
            ],
            zoneAxis: 'x',
            zones: [
                { color: 'green', value: 1 },
                { color: 'red', value: 2 }
            ]
        }
    ]
});
