$(function () {

    $('#container').highcharts({

        chart: {
            polar: true,
            type: 'arearange'
        },

        title: {
            text: 'Polar arearange'
        },
        yAxis: {
            min: 0,
            max: 2
        },

        series: [{
            connectEnds: true,
            data: [
                [1, 2],
                [1, 2],
                [1, 2],
                [1, 2],
                [1, 2],
                [1, 2]
            ]
        }]

    });

});