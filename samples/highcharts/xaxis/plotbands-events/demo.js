$(function () {
    var $report = $('#report');

    $('#container').highcharts({
        xAxis: {
            plotBands: [{ // mark the weekend
                color: '#FCFFC5',
                from: Date.UTC(2010, 0, 2),
                to: Date.UTC(2010, 0, 4),
                events: {
                    click: function (e) {
                        $report.html(e.type);
                    },
                    mouseover: function (e) {
                        $report.html(e.type);
                    },
                    mouseout: function (e) {
                        $report.html(e.type);
                    }
                }
            }],
            tickInterval: 24 * 3600 * 1000,
            // one day
            type: 'datetime'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4],
            pointStart: Date.UTC(2010, 0, 1),
            pointInterval: 24 * 3600 * 1000
        }]
    });
});