$(function () {
    $('#container').highcharts({

        chart: {
            type: 'area',
            polar: true,
            height: 500
        },
        title: {
            text: 'polar: true, stacking: "percent"'
        },
        plotOptions: {
            area: {
                stacking: 'percent'
            }
        },

        series: [{
            type: 'area',
            data: [1, 1, null, 1, 1, 1]
        }, {
            type: 'area',
            data: [1, 1, 1, null, 1, 1]
        }]

    });
});