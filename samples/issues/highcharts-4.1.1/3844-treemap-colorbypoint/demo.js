$(function () {
    $('#container').highcharts({
        series: [{
            type: "treemap",
            data: [1, 2, 3],
            colorByPoint: true
        }]
    });
});