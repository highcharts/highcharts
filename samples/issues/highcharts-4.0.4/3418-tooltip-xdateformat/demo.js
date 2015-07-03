$(function () {

    $('#container').highcharts({

        title: {
            text: 'Tooltip showed week formats, should be date'
        },

        xAxis: {
            type: 'datetime'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            pointStart: Date.UTC(2014, 0, 1),
            pointInterval: 2 * 24 * 36e5
        }]

    });
});
