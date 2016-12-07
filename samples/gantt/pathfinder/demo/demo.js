$(function () {
    var chart = Highcharts.chart('container', {
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            type: 'scatter'
        }]
    });

    chart.series[0].points[0].pathTo(chart.series[0].points[1]);
});
