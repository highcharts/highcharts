$(function () {
    $('#container').highcharts({
        chart: {
            type: 'areaspline'
        },
        plotOptions: {
            areaspline: {
                stacking: 'normal'
            }
        },
        series: [{
            data: [null, 1, 1, 1, null]
        }, {
            data: [null, 1, 3, 1, null]
        }]
    });
});
