$(function () {
    $('#container').highcharts({
        title: {
            text: 'Minor grid lines on datetime axis'
        },
        series: [{
            data: [[1349003880000, 106.3],
                   [1349004169000, 16.4],
                   [1349004426000, 2.84],
                   [1349004725000, 2.79]]
            }],
        xAxis: {
            type: 'datetime',
            minorTickInterval: 'auto',
            gridLineWidth: 1

        }
    });
});