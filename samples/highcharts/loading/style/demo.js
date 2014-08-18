$(function () {
    // the button handler
    var isLoading = false,
        $button = $('#button'),
        chart;

    $button.click(function () {
        if (!isLoading) {
            chart.showLoading();
            $button.html('Hide loading');
        } else {
            chart.hideLoading();
            $button.html('Show loading');
        }
        isLoading = !isLoading;
    });


    // create the chart
    $('#container').highcharts({

        loading: {
            labelStyle: {
                color: 'white'
            },
            style: {
                backgroundColor: 'gray'
            }
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
    chart = $('#container').highcharts();

});