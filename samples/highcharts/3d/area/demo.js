Highcharts.chart('container', {
    chart: {
        type: 'area',
        margin: 75,
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 15,
            depth: 50
        }
    },
    plotOptions: {
        area: {
            depth: 25
        }
    },
    series: [
        {
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 20]
        }
    ]
});
