$(function () {
    $('#container').highcharts({

        chart: {
            polar: true
        },

        series: [{
            connectNulls: true,
            // First value is null in series
            data: [null, 71.5, null, null, null, null, null, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });
});