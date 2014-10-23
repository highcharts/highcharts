$(function () {
    $('#container').highcharts({
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    // button handler
    var chart = $('#container').highcharts(),
        i = 0;
    $('#button').click(function () {

        if (i === chart.series[0].data.length) {
            i = 0;
        }
        chart.series[0].data[i].select();
        i += 1;
    });
});