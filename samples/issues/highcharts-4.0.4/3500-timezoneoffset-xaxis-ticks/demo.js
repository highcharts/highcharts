$(function () {
    Highcharts.setOptions({
        global: {
            timezoneOffset: 240
        }
    });

    $('#container').highcharts({

        chart: {
            width: 600
        },

        title: {
            text: 'Monthly ticks'
        },

        xAxis: {
            type: 'datetime',
            labels: {
                format: '{value:%Y-%m-%d<br>%H:%M}'
            },
            startOnTick: true,
            endOnTick: true
        },

        series: [{
            data: [{
                x: Date.UTC(2014, 0, 1),
                y: 3
            }, {
                x: Date.UTC(2014, 1, 1),
                y: 5
            }, {
                x: Date.UTC(2014, 2, 1),
                y: 7
            }, {
                x: Date.UTC(2014, 3, 1),
                y: 2
            }, {
                x: Date.UTC(2014, 4, 1),
                y: 5
            }],
            pointStart: Date.UTC(2014, 0, 1),
            pointInterval: 24 * 36e5
        }]

    });
});
