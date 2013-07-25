$(function () {
    $('#container').highcharts({

        series: [{
            data: [1, 2, 3]
        }, {
            data: [3, 2, 1]
        }, {
            data: []
        }]
    });
});