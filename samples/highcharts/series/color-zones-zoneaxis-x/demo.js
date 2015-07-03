$(function () {

    var colors = Highcharts.getOptions().colors;

    $('#container').highcharts({
        title: {
            text: 'Zones on X axis'
        },
        subtitle: {
            text: 'Colors signify periods of increase and decrease'
        },
        xAxis: {
            type: 'datetime'
        },
        series: [{
            type: 'areaspline',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            pointStart: Date.UTC(2015, 0),
            pointIntervalUnit: 'month',
            zoneAxis: 'x',
            zones: [{
                value: Date.UTC(2015, 5),
                color: colors[2]
            }, {
                value: Date.UTC(2015, 6),
                color: colors[5]
            }, {
                value: Date.UTC(2015, 8),
                color: colors[2]
            }, {
                color: colors[5]
            }]
        }]
    });
});