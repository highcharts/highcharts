$(function () {
    $('#container').highcharts({
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: {
            title: {
                margin: 60
            }
        },

        legend: {
            enabled: false
        },

        credits: {
            enabled: false
        },

        series: [{
            data: [29900, 71500, 106400, 129200, 144000, 176000, 135600, 148500, 216400, 194100, 95600, 54400]
        }]
    });
});