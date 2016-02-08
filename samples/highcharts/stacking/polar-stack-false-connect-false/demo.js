$(function () {
    $('#container').highcharts({

        chart: {
            type: 'area',
            polar: true,
            height: 500
        },
        title: {
            text: 'polar: true, stacking: false, connectNulls: false'
        },
        plotOptions: {
            area: {
                connectNulls: false,
                stacking: false
            }
        },

        series: [{
            type: 'area',
            data: [1, 1, null, 1, 1]
        }]

    });
});