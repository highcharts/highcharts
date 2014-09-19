$(function () {
    $('#container').highcharts({

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });


    // the button action
    var i = 0;
    $('#button').click(function () {
        var chart = $('#container').highcharts();
        chart.series[0].addPoint(50 * (i % 3));
        i += 1;
    });
});