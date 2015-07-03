$(function () {
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: {
            title: {
                text: 'Temperature'
            },
            lineWidth: 2,
            lineColor: '#F33',
            id: 'temperature-axis'
        },

        series: [{
            name: 'Temperature',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6],
            color: '#F33'
        }]
    });

    // the button handlera
    var chart = $('#container').highcharts();
    $('#add').click(function () {
        chart.addAxis({ // Secondary yAxis
            id: 'rainfall-axis',
            title: {
                text: 'Rainfall'
            },
            lineWidth: 2,
            lineColor: '#08F',
            opposite: true
        });
        chart.addSeries({
            name: 'Rainfall',
            type: 'column',
            color: '#08F',
            yAxis: 'rainfall-axis',
            data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        });
        $(this).attr('disabled', true);
        $('#remove').attr('disabled', false);
    });
    $('#remove').click(function () {
        chart.get('temperature-axis').remove();

        $(this).attr('disabled', true);
        $('#add').attr('disabled', false);
    });
});