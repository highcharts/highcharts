$(function () {
    $('#container').highcharts({

        chart: {
            type: 'area',
            polar: true,
            height: 500
        },
        title: {
            text: 'polar: true, stacking: "normal", connectEnds: false'
        },
        plotOptions: {
            area: {
                connectEnds: false,
                stacking: 'normal'
            }
        },

        series: [{
            data: [1, 1, 1, 1, 1]
        }, {
            data: [1, 1, 1, 1, 1]
        }]

    });
});