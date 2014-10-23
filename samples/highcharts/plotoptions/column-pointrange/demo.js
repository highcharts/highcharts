$(function () {
    $('#container').highcharts({
        chart: {
            type: 'column'
        },

        xAxis: {
            type: 'datetime',
            tickInterval: 24 * 3600 * 1000
        },

        title: {
            text: 'One point per day'
        },

        plotOptions: {
            series: {
            }
        },

        series: [{
            data: [{
                x: Date.UTC(2012, 0, 1),
                y: 1
            }, {
                x: Date.UTC(2012, 0, 8),
                y: 3
            }, {
                x: Date.UTC(2012, 0, 15),
                y: 2
            }, {
                x: Date.UTC(2012, 0, 22),
                y: 4
            }],
            pointRange: 24 * 3600 * 1000
        }]
    });
});