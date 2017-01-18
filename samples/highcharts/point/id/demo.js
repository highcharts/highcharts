$(function () {
    var chart = Highcharts.chart('container', {
        chart: {
            type: 'line'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, {
                y: 216.4,
                id: 'highest'
            }, 194.1, 95.6, 54.4]
        }]
    });

    // button handler
    $('#button').click(function () {
        var highest = chart.get('highest');
        if (highest) {
            highest.remove();
        }
    });
});
