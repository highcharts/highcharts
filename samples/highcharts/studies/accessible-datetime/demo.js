$(function () {

    $('#container').highcharts({
        accessibility: {
            enabled: true,
            description: 'Random data on a date axis.'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        tooltip: {
            formatter: function () {
                return '<b>' + this.series.name + '</b><br/>' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                    Highcharts.numberFormat(this.y, 2);
            }
        },
        series: [{
            pointStart: Date.UTC(2016, 0, 1, 13, 40, 23),
            pointInterval: 1000,
            data: [1, 3, 4, 6, 7, 5, 3, 4, 8, 9, 7, 6, 4, 3]
        }]

    });
});
