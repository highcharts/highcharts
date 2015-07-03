$(function () {
    $('#container').highcharts({

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4]
        }]
    });


    // the button action
    var chart = $('#container').highcharts(),
        $button = $('#button');
    $button.click(function () {
        var series = chart.series[0];
        if (series.visible) {
            series.hide();
            $button.html('Show series');
        } else {
            series.show();
            $button.html('Hide series');
        }
    });
});