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
    var hasPlotLine = false,
        $button = $('#button'),
        chart = $('#container').highcharts();

    $button.click(function () {
        if (!hasPlotLine) {
            chart.xAxis[0].addPlotLine({
                value: 5.5,
                color: 'red',
                width: 2,
                id: 'plot-line-1'
            });
            $button.html('Remove plot line');
        } else {
            chart.xAxis[0].removePlotLine('plot-line-1');
            $button.html('Add plot line');
        }
        hasPlotLine = !hasPlotLine;
    });
});