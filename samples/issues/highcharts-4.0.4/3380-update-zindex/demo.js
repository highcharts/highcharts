$(function () {
    $("#b").click(function () {
        $('#container').highcharts().series[0].update({
            zIndex: 1
        });
    });

    $('#container').highcharts({
        title: {
            text: 'Yellow line should be on top after click'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        plotOptions: {
            series: {
                lineWidth: 5
            }
        },

        series: [{
            type: 'column',
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            color: 'blue',
            zIndex: 3
        }, {
            data: [216.4, 194.1, 95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5],
            color: 'yellow',
            zIndex: 2
        }]
    });
});