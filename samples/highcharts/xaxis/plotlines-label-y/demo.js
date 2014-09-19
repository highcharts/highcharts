$(function () {
    $('#container').highcharts({
        xAxis: {
            tickInterval: 24 * 3600 * 1000, // one day
            type: 'datetime'
        },

        yAxis: {
            plotLines: [{
                color: 'red',
                width: 2,
                value: 100,
                label: {
                    text: 'Plot line',
                    align: 'right',
                    x: -10,
                    y: 16
                }
            }]
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
            pointStart: Date.UTC(2010, 0, 1),
            pointInterval: 24 * 3600 * 1000
        }]
    });
});