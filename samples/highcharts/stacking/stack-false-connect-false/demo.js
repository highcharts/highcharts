$(function () {
    $('#container').highcharts({

        chart: {
            type: 'area'
        },
        title: {
            text: 'stacking: false, connectNulls: false'
        },
        series: [{
            type: 'area',
            data: [1, 1, null, 1, 1]
        }]

    });
});