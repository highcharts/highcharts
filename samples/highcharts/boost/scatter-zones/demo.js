Highcharts.chart('container', {
    title: {
        text: 'Boosted series with <em>zones</em>'
    },
    series: [{
        type: 'scatter',
        boostThreshold: 1,
        data: Array.from({ length: 10000 }, (_, i) => (
            [i, Math.random()]
        )),
        zones: [{
            value: 8000,
            color: 'var(--highcharts-color-0)'
        }, {
            color: 'var(--highcharts-color-1)'
        }],
        zoneAxis: 'x'
    }]
});
