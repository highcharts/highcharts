$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },
        title: {
            text: 'Bug in Highcharts <= 3.0.9. Only one pie should remain visible'
        },
        series: [{
            data: [29.9, 71.5, 148.5, 216.4, 194.1, 95.6, 54.4],
            center: [100,100]
        }, {
            data: [129.2, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4],
            center: [330,100]
        }]
    }, function (chart) {
        chart.series[0].hide();
    });

});