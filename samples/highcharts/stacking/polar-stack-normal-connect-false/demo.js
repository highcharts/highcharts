$(function () {
    $('#container').highcharts({

        chart: {
            type: 'area',
            polar: true,
            height: 500
        },
        title: {
            text: 'polar: true, stacking: "normal", connectNulls: false'
        },
        plotOptions: {
            area: {
                connectNulls: false,
                stacking: 'normal'
            }
        },

        series: [{
            data: [1, 1, null, 1, 1, 1]
        }, {
            data: [1, 1, 1, null, 1, 1]
        }]

    });
});