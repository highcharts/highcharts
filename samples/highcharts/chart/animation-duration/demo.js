$(function () {
    $('#container').highcharts({

        chart: {
            animation: {
                duration: 1000
            }
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });

    var i = 1;
    $('#update').click(function () {
        var chart = $('#container').highcharts();
        chart.series[0].data[0].update(i % 2 ? 200 : 0);
        i += 1;
    });
});