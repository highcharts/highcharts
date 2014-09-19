$(function () {
    $('#container').highcharts({

        legend: {
            layout: 'vertical',
            floating: true,
            align: 'left',
            verticalAlign: 'top',
            x: 90,
            y: 45,
            symbolPadding: 20,
            symbolWidth: 50
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }, {
            data: [95.6, 54.4, 29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1]
        }]
    });
});