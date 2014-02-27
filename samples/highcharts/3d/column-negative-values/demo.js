$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            margin: 75,
            is3d: true,
            options3d: {
                alpha: 15,
                beta: 15,
                depth: 50,
            }
        },
        xAxis: {
            gridLineWidth: 1
        },
        plotOptions: {
            column: {
                stacking: true,
                depth: 25,
                groupZPadding: 15
            }
        },
        series: [{
            data: [2, 3, null, 4, 0, 3],
        },{
            data: [-1, -2, -4, -3, -1, 0],
        }]
    });
});