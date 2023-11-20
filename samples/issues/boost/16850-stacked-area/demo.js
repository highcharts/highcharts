Highcharts.chart('container', {
    title: {
        text: 'The stem (simplified area) of the points should be visible'
    },
    yAxis: {
        type: 'logarithmic'
    },
    series: [{
        data: [1, 2, 4, 8, 16, 32, 64, 128, 256, 512]
    }],
    chart: {
        type: 'area'
    },
    plotOptions: {
        area: {
            stacking: 'normal'
        },
        series: {
            boostThreshold: 10
        }
    }
});
