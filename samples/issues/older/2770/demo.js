$(function () {


    $('#container').highcharts({
        title: {
            text: 'Highcharts <= 3.0.9: Data labels on error bars not displayed.'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [{
            name: 'Rainfall error',
            type: 'errorbar',
            data: [
                [48, 51],
                [68, 73],
                [92, 110]
            ]
        }]
    });

});