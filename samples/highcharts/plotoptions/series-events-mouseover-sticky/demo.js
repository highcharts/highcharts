$(function () {
    var $report = $('#report');

    $('#container').highcharts({
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                events: {
                    mouseOver: function () {
                        $report.html('Moused over')
                            .css('color', 'green');
                    },
                    mouseOut: function () {
                        $report.html('Moused out')
                            .css('color', 'red');
                    }
                }
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});