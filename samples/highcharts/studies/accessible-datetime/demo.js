$(function () {
    var data = [],
        time = (new Date()).getTime();

    for (var i = -19; i <= 0; ++i) {
        data.push({
            x: time + i * 1000,
            y: Math.random()
        });
    }

    Highcharts.setOptions({
        global: {
            useUTC: false
        }
    });

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
            data: data
        }]

    });
});
