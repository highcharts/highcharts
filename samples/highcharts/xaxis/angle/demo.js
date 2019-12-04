Highcharts.chart('container', {
    chart: {
        type: 'column',
        inverted: true,
        polar: true,
        marginTop: 25
    },
    title: {
        text: 'Custom xAxis\' angle on inverted polar chart'
    },
    xAxis: {
        angle: 324,
        tickInterval: 1,
        lineWidth: 2,
        lineColor: Highcharts.getOptions().colors[0],
        labels: {
            zIndex: 10,
            x: 5,
            y: -5,
            style: {
                color: Highcharts.getOptions().colors[0]
            }
        }
    },
    yAxis: {
        min: 0,
        max: 10
    },
    series: [{
        borderWidth: 0,
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }]
});