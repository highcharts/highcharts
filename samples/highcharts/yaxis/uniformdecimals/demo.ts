Highcharts.chart('container', {
    title: {
        text: 'Demo of axis <em>uniformDecimals</em> options'
    },
    xAxis: {
        tickInterval: 0.25,
        uniformDecimals: true
    },
    yAxis: {
        uniformDecimals: true
    },
    series: [{
        data: [0.5, 1.5, 1, 2]
    }]
});
