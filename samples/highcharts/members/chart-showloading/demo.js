$(function () {


    // create the chart
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    var chart = $('#container').highcharts();
    $('#button1').click(function () {
        chart.showLoading('Loading AJAX...');
    });
    $('#button2').click(function () {
        chart.showLoading('Loading image...');
    });
    $('#button3').click(function () {
        chart.showLoading();
    });
    $('#button4').click(function () {
        chart.hideLoading();
    });
});