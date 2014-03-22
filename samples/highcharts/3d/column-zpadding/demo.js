$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            margin: [100,50,50,50],
            options3d: {
				enabled: true,
                alpha: 15,
                beta: 15,
                depth: 250,
                frame: {
                    bottom: {
                        size: 2,
                        color: '#C0C0C0'
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
        },{
            data: [4, null, 1, 2, 1, 3]
        }]
    });
});