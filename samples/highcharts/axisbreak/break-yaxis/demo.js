$(function () {
    $('#container').highcharts({

        title: {
            text: 'Sample of a break on the yAxis'
        },

        yAxis: {
            tickInterval: 10,
            breaks: [{
                from: 31,
                to: 110,
                breakSize: 5
            }]
        },

        series: [{
            type: 'column',
            data: [10, 15, 17, 120, 25, 18, 12]
        }]
    });
});