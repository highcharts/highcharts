$(function () {
    var chart = $('#container').highcharts({
        chart: {
            type: 'pie'
        },

        series: [{
            data: [29.9, 71.5, 106.4]
        }]
    }, null, true);

    // button handler
    $('#button').click(function() {
       chart.series[0].data[0].slice();
    });
});