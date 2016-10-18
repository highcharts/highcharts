$(function () {
    var w = 1;
    $('#container').highcharts({

        chart: {
            plotBorderWidth: w,
            plotBorderColor: 'green',
            width: 400
        },

        title: {
            text: 'Test that axis lines cover plotBorder',
            align: 'left'
        },

        subtitle: {
            text: '- No colored lines should be visible next to the plot border.<br/>' +
                '- In the line segments close to axis (Mar-Apr, Oct-Nov), <br/>' +
                'half the line should be visible.',
            align: 'left'
        },
        xAxis: [{
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            lineWidth: w,
            gridLineWidth: w,
            gridLineColor: 'red',
            tickColor: 'red',
            tickPosition: 'inside',
            min: 0,
            max: 11
        }, {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            opposite: true,
            lineWidth: w
        }],

        yAxis: [{
            lineWidth: w,
            gridLineColor: 'red',
            min: 0,
            max: 250,
            tickInterval: 50,
            tickAmount: 6
        }, {
            lineWidth: w,
            opposite: 'true',
            tickAmount: 6
        }],
        series: [{
            data: [200, 29.9, 71.5, 0, 0, 129.2, 144.0, 176.0, 135.6, 148.5, 250, 250, 194.1, 0],
            pointStart: -1

        }]

    });
});