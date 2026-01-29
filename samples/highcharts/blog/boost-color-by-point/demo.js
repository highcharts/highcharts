Highcharts.chart('container', {
    title: {
        text: 'Boosted series colored by point'
    },
    legend: {
        enabled: false
    },
    series: [{
        type: 'scatter',
        colorByPoint: true,
        boostThreshold: 1,
        data: Array.from({ length: 10000 }, (_, i) => (
            [i, Math.random()]
        ))
    }]
});