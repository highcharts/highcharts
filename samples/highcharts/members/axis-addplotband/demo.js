$(function () {
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });


    // the button action
    var hasPlotBand = false,
        chart = $('#container').highcharts(),
        $button = $('#button');

    $button.click(function () {
        if (!hasPlotBand) {
            chart.xAxis[0].addPlotBand({
                from: 5.5,
                to: 7.5,
                color: '#FCFFC5',
                id: 'plot-band-1'
            });
            $button.html('Remove plot band');
        } else {
            chart.xAxis[0].removePlotBand('plot-band-1');
            $button.html('Add plot band');
        }
        hasPlotBand = !hasPlotBand;
    });
});