Highcharts.chart('container', {
    chart: {
        polar: true
    },
    title: {
        text: 'Demo of <em>yAxis.gridLineInterpolation</em>'
    },
    xAxis: {
        lineWidth: 0,
        max: 360,
        min: 0,
        tickInterval: 45
    },
    yAxis: {
        gridLineInterpolation: 'polygon'
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            pointInterval: 45
        }
    },
    series: [{
        data: [29.9, 71.5, 106.4, 129.2, 144, 176, 135.6, 148.5]
    }]
} satisfies Highcharts.Options);
