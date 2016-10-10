$(function () {
    Highcharts.chart('container', {
        series: [{
            type: "treemap",
            data: [1, 2, 3],
            colorByPoint: true
        }]
    });
});
