Highcharts.chart('container', {
    title: {
        text: 'Demo of axis <em>allowDecimals</em> options'
    },
    xAxis: {
        allowDecimals: false,
        tickPixelInterval: 50
    },
    yAxis: {
        allowDecimals: false
    },
    series: [{
        data: [0.5, 1.5, 1, 2]
    }]
});
