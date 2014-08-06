$(function () {
    $('#container').highcharts({

        title: {
            text: 'Axis.update() demo'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    });


    var chart = $('#container').highcharts(),
        type = 1,
        types = ['linear', 'datetime', 'logarithmic'],
        opposite = true,
        lineWidth = 2,
        lineColor = 'red';

    $('#toggle-type').click(function () {
        chart.yAxis[0].update({
            type: types[type]
        });
        type += 1;
        if (type === types.length) {
            type = 0;
        }
    });

    $('#toggle-opposite').click(function () {
        chart.yAxis[0].update({
            opposite: opposite
        });
        opposite = !opposite;
    });

    $('#toggle-linewidth').click(function () {
        chart.yAxis[0].update({
            lineWidth: lineWidth
        });
        lineWidth = (lineWidth + 2) % 4;
    });

    $('#toggle-linecolor').click(function () {
        chart.yAxis[0].update({
            lineColor: lineColor
        });
        lineColor = { red: 'blue', blue: 'red' }[lineColor];
    });
});