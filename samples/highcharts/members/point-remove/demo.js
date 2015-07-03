$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2]
        }]
    });

    // button handler
    $('#button').click(function () {
        var chart = $('#container').highcharts(),
            series = chart.series[0];
        if (series.data.length) {
            chart.series[0].data[0].remove();
        }
    });
});