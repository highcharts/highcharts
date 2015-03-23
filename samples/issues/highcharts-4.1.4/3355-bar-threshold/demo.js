$(function () {
    $('#container').highcharts({
        title: {
            text: 'Bar center was off'
        },
        chart: {
            width: 501,
            height: 500,
            margin: 80,
            type: 'bar'
        },
        plotOptions: {
            series: {
                borderWidth: 0
            }
        },
        series: [{
            data: [-25, -50, -100, 25, 50, 100]
        }]
    });
});