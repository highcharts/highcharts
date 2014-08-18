$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            margin: 75,
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 60
            }
        },
        plotOptions: {
            column: {
                depth: 40,
                stacking: true
            }
        },
        series: [{
            data: [1, 2, 4],
            stack: 0
        }, {
            data: [5, 6, 3],
            stack: 0
        }, {
            data: [7, 9, 8],
            stack: 1
        }]
    });
});