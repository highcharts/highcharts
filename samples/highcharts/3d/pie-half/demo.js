$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie',
            is3d: true,
            options3d: {
                alpha: 25
            }
        },
        plotOptions: {
            pie: {
                innerSize: 100,
                depth: 45  
            }
        },
        series: [{
            data: [2, 4, 6, 1, 3]          
        }]
    });
});