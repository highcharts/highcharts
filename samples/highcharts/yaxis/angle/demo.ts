Highcharts.chart('container', {
    chart: {
        polar: true
    },
    title: {
        text: 'Demo of <em>yAxis.angle</em>'
    },
    xAxis: {
        max: 360,
        min: 0,
        tickInterval: 30
    },
    yAxis: {
        angle: 30,
        lineWidth: 2
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            pointInterval: 30
        }
    },
    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5, 216.4, 194.1,
            95.6, 54.4
        ]
    }]
} satisfies Highcharts.Options);
