Highcharts.chart('container', {
    chart: {
        inverted: true,
        polar: true,
        type: 'column'
    },
    title: {
        text: 'Demo of <em>xAxis.angle</em>'
    },
    xAxis: {
        angle: 350,
        lineWidth: 2,
        tickInterval: 1
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
});
