Highcharts.chart('container', {
    chart: {
        type: 'area3d',
        options3d: {
            enabled: true,
            alpha: 20,
            beta: 30,
            depth: 300,
            frame: {
                bottom: {
                    size: 1,
                    color: 'rgba(0,0,0,0.05)'
                }
            }
        }
    },
    plotOptions: {
        series: {
            depth: 100,
            groupZPadding: 100
        }
    },
    title: {
        text: 'a 3D Area Chart'
    },
    series: [{
        data: [10, 20, 24, 25, 28, 27, 20, 18, 15, 16]
    }, {
        data: [25, 28, 35, 40, 35, 20, 10, 15, 25, 30]
    }]
});