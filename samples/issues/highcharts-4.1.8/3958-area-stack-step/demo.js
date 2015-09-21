$(function () {
    var series = [],
        axes = [];
    Highcharts.setOptions({
        chart: {
            type: 'area'
        },
        plotOptions: {
            series: {
                stacking: "normal"
            }
        }
    });

    $.each(['center', 'right', 'left'], function(i, step) {
        axes.push({
            offset: 0,
            height: '30%',
            top: i * 33 + '%'
        });
        series.push({
            stack: step,
            yAxis: i,
            data: [1, 2, 3, 4, 5, 6, 7, 10, 9],
            step: step
        }, {
            stack: step,
            yAxis: i,
            data: [5, 14, 7, 8, 12, 10, 11, 14, 13],
            step: step
        });
    });

    $("#container").highcharts({ 
        yAxis: axes,
        series: series 
    });
});