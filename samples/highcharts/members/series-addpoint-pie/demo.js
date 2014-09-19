$(function () {
    $('#container').highcharts({

        chart: {
            type: 'pie'
        },

        series: [{
            data: [29.9, 71.5, 106.4]
        }]
    });

    // the button action
    var i = 0;
    $('#button').click(function () {
        var chart = $('#container').highcharts();
        chart.series[0].addPoint((50 * (i % 3)) + 10);
        i += 1;
    });
});