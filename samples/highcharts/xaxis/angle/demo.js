Highcharts.chart('container', {
    chart: {
        polar: true,
        inverted: true,
        type: 'column'
    },
    title: {
        text: 'Different xAxis\' angle on inverted polar chart'
    },
    yAxis: {
        min: 0,
        max: 10
    },
    xAxis: {
        angle: 324,
        tickInterval: 1,
        lineWidth: 2,
        lineColor: Highcharts.getOptions().colors[0],
        labels: {
            zIndex: 10,
            x: 6,
            y: -5,
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        }
    },
    series: [{
        borderWidth: 0,
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }]
});
