$(function () {
    var chart = $('#container').highcharts({
        chart: {
            type: 'pie'
        },
        xAxis: {
        },

        series: [{
            data: [29.9, 71.5, 106.4]
        }]
    }, null, true);

    // button handler
    var y = 30;
    $('#button').click(function() {
       chart.series[0].data[0].update(y += 10);
    });
});