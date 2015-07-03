$(function () {
    $('#container').highcharts({

        chart: {
            zoomType: 'x'
        },

        title: {
            text: 'Hide overlapping data labels'
        },

        series: [{
            data: (function (arr, len) {
                var i;
                for (i = 0; i < len; i = i + 1) {
                    arr.push(i);
                }
                return arr;
            }([], 50)),
            dataLabels: {
                enabled: true,
                y: -5
            }
        }]

    });

    $('#setextremes').click(function () {
        $('#container').highcharts().xAxis[0].setExtremes(10, 15);
    });

    $('#unsetextremes').click(function () {
        $('#container').highcharts().xAxis[0].setExtremes();
    });
});