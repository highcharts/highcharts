$(function () {

    Highcharts.setOptions({
        lang: {
            numericSymbols: [' thousands', ' millions']
        }
    });

    $('#container').highcharts({
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            type: 'logarithmic'
        },

        series: [{
            data: [0.029, 71.5, 1.06, 1292, 14400, 1.760, 135, 1480, 0.0216, 0.194, 9.56, 54.4]
        }]
    });
});