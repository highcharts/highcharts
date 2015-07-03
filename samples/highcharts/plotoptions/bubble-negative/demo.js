$(function () {
    $('#container').highcharts({

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },

        title: {
            text: 'Highcharts with negative bubbles'
        },

        xAxis: {
            gridLineWidth: 1
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false
        },

        series: [{
            data: [
                [9, 81, 13],
                [98, 5, 39],
                [51, 50, 23],
                [41, 22, -36],
                [58, 24, -30],
                [78, 37, -16],
                [55, 56, 3],
                [18, 45, 20],
                [42, 44, -22],
                [3, 52, 9],
                [31, 18, 47],
                [79, 91, 13],
                [93, 23, -27],
                [44, 83, -28]
            ],
            // displayNegative: true,
            negativeColor: Highcharts.getOptions().colors[1]
            // zThreshold: 0
        }]

    });
});