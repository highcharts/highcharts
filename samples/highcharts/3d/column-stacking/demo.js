$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            margin: 75,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 40
            }
        },
        plotOptions: {
            column: {
                depth: 40,
                stacking: true
            }
        },
        series: [{
            data: [1, 2, 4]
        }, {
            data: [5, 6, 3]
        }]
    });
});