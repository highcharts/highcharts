$(function () {
    var chart = Highcharts.chart('container', {
        chart: {
            height: 300
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    // the button handler
    $('#button').click(function () {
        chart.destroy();
        $(this).attr('disabled', true);
    });
});
