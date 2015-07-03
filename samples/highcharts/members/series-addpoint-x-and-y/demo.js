$(function () {
    $('#container').highcharts({
        chart: {
            type: 'scatter'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });


    // the button action
    var random = 0.5; // for first, automated test
    $('#button').click(function () {
        var chart = $('#container').highcharts();
        chart.series[0].addPoint([
            (random || Math.random()) * 12,
            (random || Math.random()) * 200
        ]);
        random = null;
    });
});