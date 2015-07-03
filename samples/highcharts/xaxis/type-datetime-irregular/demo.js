$(function () {
    $('#container').highcharts({
        xAxis: {
            type: 'datetime'
        },
        series: [{
            data: [
                [Date.UTC(2010, 0, 1), 29.9],
                [Date.UTC(2010, 0, 2), 71.5],
                [Date.UTC(2010, 0, 3), 106.4],
                [Date.UTC(2010, 0, 6), 129.2],
                [Date.UTC(2010, 0, 7), 144.0],
                [Date.UTC(2010, 0, 8), 176.0]
            ]
        }]

    });
});