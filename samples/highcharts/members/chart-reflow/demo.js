$(function () {
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });

    var wide = false;
    $('#set-div-size').click(function () {
        $('#container').width(wide ? 400 : 500);
        wide = !wide;
    });
    $('#reflow-chart').click(function () {
        $('#container').highcharts().reflow();
    });
});
