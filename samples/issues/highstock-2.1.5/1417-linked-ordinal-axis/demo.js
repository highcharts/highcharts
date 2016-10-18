$(function () {
    $('#container').highcharts({

        xAxis: [{
            ordinal: true,
            gridLineWidth: 1
        }, {
            linkedTo: 0,
            opposite: true
        }],

        series: [{
            data: [
                [1, 15],
                [2, 10],
                [4, 5],
                [5, 15]
            ]
        }]
    });

});
