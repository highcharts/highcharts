$(function () {
    $('#container').highcharts({
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],

            plotLines: [{ // summer months - treat from/to as numbers
                color: '#FF0000',
                width: 2,
                value: 5.5,
                id: 'plotline-1'
            }]
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    // button action
    $('#button').click(function () {
        var chart = $('#container').highcharts();
        chart.xAxis[0].removePlotLine('plotline-1');
    });
});