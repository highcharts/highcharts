Highcharts.chart('container', {
    chart: {
        type: 'area',
        options3d: {
            enabled: true,
            alpha: 15,
            beta: 15,
            depth: 50
        }
    },
    plotOptions: {
        area: {
            depth: 20,
            stacking: 'normal',
            lineColor: '#666666',
            lineWidth: 1
        }
    },
    series: [
        {
            data: [20, 20, 30, 40, 50, 30, 20, 10]
        },
        {
            data: [20, 20, 30, 40, 50, 30, 20, 10]
        },
        {
            data: [20, 20, 40, 40, 50, 30, 20, 10],
            stacking: false
        }
    ]
});
