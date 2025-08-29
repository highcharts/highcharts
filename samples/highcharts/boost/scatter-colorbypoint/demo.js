Highcharts.chart('container', {
    series: [{
        type: 'scatter',
        colorByPoint: true,
        boostThreshold: 1,
        data: Array.from({ length: 10000 }, (_, i) => (
            [i, Math.random()]
        ))
    }]
});
