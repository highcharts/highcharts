$(function () {
    var i = 1;

    var chart = Highcharts.chart('container', {
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


    $('#title').click(function () {
        chart.title.update({ text: 'New title ' + i });
        i += 1;
    });
    $('#subtitle').click(function () {
        chart.subtitle.update({ text: 'New title ' + i });
        i += 1;
    });
    $('#color').click(function () {
        chart.title.update({
            style: {
                color: 'red'
            }
        });
        chart.subtitle.update({
            style: {
                color: 'green'
            }
        });
    });
});
