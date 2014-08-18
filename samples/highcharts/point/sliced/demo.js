$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },

        series: [{
            data: [
                {
                    name: 'Firefox',
                    y: 44.2,
                    sliced: true
                },
                ['IE7',       26.6],
                ['IE6',       20],
                ['Chrome',    3.1],
                ['Other',    5.4]
            ]
        }]
    });
});