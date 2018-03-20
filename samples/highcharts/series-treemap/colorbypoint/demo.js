// Highcharts 4.1.1, Issue 3844
// treemap - colorByPoint is not working
$(function () {
    $('#container').highcharts({
        series: [{
            type: "treemap",
            data: [1, 2, 3],
            colorByPoint: true
        }]
    });
});