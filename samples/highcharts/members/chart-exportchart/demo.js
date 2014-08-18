$(function () {
    $('#container').highcharts({

        credits: {
            enabled: false
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [null, 71.5, 106.4, 129.2, null, 176.0, 135.6, 148.5, 216.4, 194.1, null, 54.4]
        }, {
            data: [129.2, null, 176.0, 135.6, 0, 216.4, 194.1, null, 54.4, null, 71.5, 106.4],
            type: 'column',
            dataLabels: {
                enabled: true
            }
        }],

        navigation: {
            buttonOptions: {
                enabled: false
            }
        }
    });

    // the button handler
    $('#button').click(function () {
        var chart = $('#container').highcharts();
        chart.exportChart();
    });
});