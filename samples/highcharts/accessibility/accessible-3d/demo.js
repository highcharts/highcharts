Highcharts.chart('container', {
    chart: {
        type: 'column',
        options3d: {
            enabled: true,
            alpha: 5,
            beta: 20,
            depth: 250,
            viewDistance: 5,
            frame: {
                bottom: {
                    size: 1,
                    color: '#ddd'
                }
            }
        }
    },

    plotOptions: {
        column: {
            grouping: false,
            depth: 50,
            groupZPadding: 50
        }
    },

    series: [{
        data: [2, 3, null, 4, 0, 5]
    }, {
        data: [4, null, 1, 2, 1, 3]
    }]
});
