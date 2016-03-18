$(function () {
    $('#container').highcharts({

        chart: {
            type: 'area'
        },
        title: {
            text: 'stacking: normal, connectNulls: true'
        },
        plotOptions: {
            area: {
                connectNulls: true,
                stacking: 'normal'
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