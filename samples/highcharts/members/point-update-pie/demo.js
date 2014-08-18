$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },
        series: [{
            data: [29.9, 71.5, 106.4],
            dataLabels: {
                format: '{point.y}'
            }
        }]
    });

    // button handler
    var chart = $('#container').highcharts(),
        y = 30;
    $('#button').click(function () {
        y += 10;
        chart.series[0].data[0].update(y);
    });
});