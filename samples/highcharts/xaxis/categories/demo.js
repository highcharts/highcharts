$(function () {
    Highcharts.chart('container', {
        title: {
            text: 'Chart without categories, falls back to numbers'
        },
        xAxis: {
        },
        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });
});