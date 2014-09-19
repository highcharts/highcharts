$(function () {
    $('#container').highcharts({

        title: {
            text: 'Up until 3.0.7, thousands separators were applied to numbers less than 10,000'
        },

        xAxis: {
            allowDecimals: false
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
            pointStart: 2004
        }]

    });


});