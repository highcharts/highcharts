$(function () {
    $('#container').highcharts({
        title: {
            text: 'X axis labels alignment'
        },
        subtitle: {
            text: 'Left side of the text should be aligned to the tick'
        },
        xAxis: {

            labels: {
                align: 'left'
            }
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            pointInterval: 500
        }]
    });
});