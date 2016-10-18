$(function () {
    $('#container').highcharts({

        yAxis: {
            type: 'logarithmic',
            min: 1
        },

        series: [{
            data: [null, null, null]
        }]

    });
});