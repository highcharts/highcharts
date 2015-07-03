$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },

        title: {
            text: 'Pie with startAngle = 90'
        },

        plotOptions: {
            pie: {
                startAngle: 90
            }
        },

        series: [{
            data: [
                ['Firefox', 44.2],
                ['IE7',     26.6],
                ['IE6',     20],
                ['Chrome',  3.1],
                ['Other',   5.4]
            ]
        }]
    });
});