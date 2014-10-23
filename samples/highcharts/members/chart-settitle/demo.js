$(function () {
    var i = 1,
        chart;

    $('#container').highcharts({
        subtitle: {
            text: 'Subtitle'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });
    chart = $('#container').highcharts();


    $('#title').click(function () {
        chart.setTitle({ text: 'New title ' + i});
        i += 1;
    });
    $('#subtitle').click(function () {
        chart.setTitle(null, { text: 'New title ' + i});
        i += 1;
    });
    $('#color').click(function () {
        chart.setTitle(
            { style: { color: 'red' }},
            { style: { color: 'green' }}
        );
    });
});