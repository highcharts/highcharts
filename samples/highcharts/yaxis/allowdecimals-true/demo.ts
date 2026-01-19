Highcharts.chart('container', {
    title: {
        text: 'Demo of axis <em>allowDecimals</em> options'
    },
    xAxis: {
        allowDecimals: true,
        tickPixelInterval: 50
    },
    yAxis: {
        allowDecimals: true
    },
    series: [{
        data: [0.5, 1.5, 1, 2]
    }]
});
