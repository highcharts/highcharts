$(function () {
    $('#container').highcharts({
        chart: {
            type: 'area'
        },
        title: {
            text: 'stacking: false, connectNulls: true'
        },
        plotOptions: {
            area: {
                connectNulls: true
            }
        },

        series: [{
            type: 'area',
            data: [1, 1, null, 1, 1]
        }]

    });
});