$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 25
            }
        },
        plotOptions: {
            pie: {
                depth: 45,
                startAngle: -90,
                endAngle: 90
            }
        },
        series: [{
            data: [2, 4, 6, 1, 3]
        }]
    });
});