$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },

        series: [{
            data: [29.9, 71.5, 106.4]
        }]
    });


    // the button action
    $('#button').click(function () {
        var chart = $('#container').highcharts();
        chart.series[0].setData([129.2, 144.0, 176.0]);
    });
});