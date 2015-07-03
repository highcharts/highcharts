$(function () {
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        plotOptions: {
            series: {
                showCheckbox: true
            }
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [194.1, 95.6, 54.4, 9.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4]
        }]
    });


    // the button action
    $('#button').click(function () {
        var chart = $('#container').highcharts(),
            selectedSeries = chart.getSelectedSeries();
        alert('You selected ' + selectedSeries.length + ' series');
    });
});