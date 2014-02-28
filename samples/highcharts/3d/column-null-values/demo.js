$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column',
            margin: 75,
            is3d: true,
            options3d: {
                alpha: 15,
                beta: 15,
                depth: 50
            }
        },
        title: {
            text: '3D chart with null values'
        },
        subtitle: {
            text: 'Notice the difference between a 0 value and a null point'
        },
        plotOptions: {
            column: {
                depth: 25  
            }
        },
        series: [{
            data: [2, 3, null, 4, 0, 5]
        }]
    });
});