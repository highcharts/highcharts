$(function () {
    $('#container').highcharts({
        chart: {
            type: 'pie'
        },

        plotOptions: {
            pie: {
                allowPointSelect: true,
                slicedOffset: 20
            }
        },

        series: [{
            data: [
                {
                    name: 'Firefox',
                    y: 44.2,
                    selected: true,
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