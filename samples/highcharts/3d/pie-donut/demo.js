$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie',
            is3d: true,
            options3d: {
                alpha: 15,
                beta: 15,
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