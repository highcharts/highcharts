$(function () {
    $('#container').highcharts({
        chart: {
            plotBorderWidth: 1
        },

        xAxis: {
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });


    // the button action
    $('#button').click(function () {
        var chart = $('#container').highcharts(),
            yAxis = chart.yAxis[0];

        yAxis.options.startOnTick = false;
        yAxis.options.endOnTick = false;

        chart.yAxis[0].setExtremes(40, 210);
    });
});