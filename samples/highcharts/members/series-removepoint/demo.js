$(function () {
    $('#container').highcharts({

        title: {
            text: 'Remove cropped point'
        },

        subtitle: {
            text: 'Click button to remove a point [0, 0] and shift zoom to verify that it is removed'
        },

        xAxis: {
            min: 100
        },

        series: [{
            data: (function (arr, i) {
                for (i = 0; i < 200; i = i + 1) {
                    arr.push(i);
                }
                return arr;
            }([])),
            cropThreshold: 100
        }]

    });

    $('#remove').click(function () {
        var chart = $('#container').highcharts();
        chart.series[0].removePoint(0);

        chart.xAxis[0].setExtremes(0, 100); // Verify that point [0, 0] is removed
    });
});