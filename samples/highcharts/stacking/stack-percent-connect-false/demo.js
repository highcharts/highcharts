$(function () {
    $('#container').highcharts({

        chart: {
            type: 'area'
        },
        title: {
            text: 'stacking: percent, connectNulls: false'
        },
        plotOptions: {
            area: {
                connectNulls: false,
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