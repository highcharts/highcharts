$(function () {
    $('#container').highcharts({

        chart: {
            marginTop: 70
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }],

        navigation: {
            buttonOptions: {
                height: 40,
                width: 48,
                symbolSize: 24,
                symbolX: 23,
                symbolY: 21,
                symbolStrokeWidth: 2
            }
        }
    });
});