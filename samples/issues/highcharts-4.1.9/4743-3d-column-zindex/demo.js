$(function () {
    $('#container').highcharts({
        chart: {
            type: "column",
            options3d: {
                enabled: true,
                alpha: 15,
                beta: 15,
                viewDistance: 25,
                depth: 5 * 50
            }
        },

        plotOptions: {
            column: {
                grouping: false,
                groupZPadding: 10,
                pointPadding: 0.2,
                depth: 40
            }
        },

        series: [{
            showInLegend: true,
            data: [8, 3, 4, 7, 2, 5, 3, 4, 7, 2, 5, 3, 4, 7, 2].sort()
        }, {
            showInLegend: true,
            data: [8, 3, 4, 7, 2, 5, 3, 4, 7, 2, 5, 3, 4, 7, 2].reverse()
        }, {
            showInLegend: true,
            data: [8, 3, 4, 7, 2, 5, 3, 4, 7, 2, 5, 3, 4, 7, 2].sort().reverse()
        }, {
            showInLegend: true,
            data: [8, 3, 4, 7, 2, 5, 3, 4, 7, 2, 5, 3, 4, 7, 2]
        }, {
            showInLegend: true,
            data: [8, 3, 4, 7, 2, 5, 3, 4, 7, 2, 5, 3, 4, 7, 2]
        }]
    });

    Highcharts.charts[0].series.forEach(function (series) {
        series.update({
            showInLegend: false
        }, false);
    });
    Highcharts.charts[0].redraw(false);
});