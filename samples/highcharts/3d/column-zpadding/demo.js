$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            margin: [100, 50, 100, 50],
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 250,
                viewDistance: 5,
                frame: {
                    bottom: {
                        size: 1,
                        color: '#EEE'
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
        yAxis: {
            title: {
                text: null
            }
        },
        series: [{
            data: [2, 3, null, 4, 0, 5]
        }, {
            data: [4, null, 1, 2, 1, 3]
        }]
    });
});