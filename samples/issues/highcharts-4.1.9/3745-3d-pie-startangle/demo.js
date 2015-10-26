$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie',
            options3d: {
                enabled: true,
                alpha: 45,
                beta: 0
            }
        },
        series: [{
            depth: 100,
            startAngle: 180,
            type: 'pie',
            innerSize : "30%",
            name: 'Browser share',
            data: [10]
        }]
    });
});