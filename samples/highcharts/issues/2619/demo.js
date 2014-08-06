$(function () {
    $('#container').highcharts({
        title: {
            text: 'Highcharts <= 3.0.9: The line was not vertically centered'
        },
        series: [{
            data: [19123456789123,19123456789123,19123456789123]
        }]
    });
});