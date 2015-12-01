$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                depth: 110
            }
        },
        plotOptions: {
            column: {
                depth: 80,
                grouping: false,
                groupZPadding: 80
            }
        },
        series: [{
            data: [0, 2, 1, 0],
            zIndex: 9
        }, {
            data: [0, 0, 0, 0],
            zIndex: 10
        }]
    });

    var chart = $('#container').highcharts();

    chart.yAxis[0].setExtremes(0, 5);
});