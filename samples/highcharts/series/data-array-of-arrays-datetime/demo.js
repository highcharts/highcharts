$(function () {
    $('#container').highcharts({
        xAxis: {
            type: 'datetime'
        },

        series: [{
            data: [
                [Date.UTC(2010, 0, 1), 29.9],
                [Date.UTC(2010, 2, 1), 71.5],
                [Date.UTC(2010, 3, 1), 106.4]
            ]
        }]
    });
});