$(function () {
    $('#container').highcharts({

        chart: {
            type: 'area',
            polar: true,
            height: 500
        },
        title: {
            text: 'polar: true, stacking: false, connectNulls: true'
        },
        plotOptions: {
            area: {
                connectNulls: true,
                stacking: false
            }
        },

        series: [{
            type: 'area',
            data: [1, 1, null, 1, 1]
        }]

    });
});