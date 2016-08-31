$(function () {
    $('#container').highcharts({

        chart: {
            type: 'area'
        },
        title: {
            text: 'stacking: percent, connectNulls: true'
        },
        plotOptions: {
            area: {
                connectNulls: true,
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