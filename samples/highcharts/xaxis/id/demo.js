$(function () {
    $('#container').highcharts({
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            id: 'x-axis'
        },

        subtitle: {
            floating: true,
            align: 'left',
            x: 100,
            y: 70

        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]
    });

    // the button action
    $('#button').click(function () {
        var chart = $('#container').highcharts();
        chart.setTitle(null, {
            text: 'The axis object: ' + chart.get('x-axis')
        });
    });
});