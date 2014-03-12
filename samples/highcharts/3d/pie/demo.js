$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie',
            options3d: {
				enabled: true,
                alpha: 45,
                beta: 0,
            }
        },
        plotOptions: {
            pie: {
                depth: 25
            }
        },
        series: [{
            data: [2, 4, 6, 1, 3]
        }]
    });
});