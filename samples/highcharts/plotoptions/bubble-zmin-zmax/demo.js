$(function () {
    $('#container').highcharts({

        chart: {
            type: 'bubble',
            plotBorderWidth: 1
        },

        title: {
            text: 'Highcharts Bubbles'
        },

        subtitle: {
            text: 'The <em>zMin</em> and <em>zMax</em> options are set to 0 and 100, bubbles should not become near the <em>maxSize</em>'
        },

        xAxis: {
            gridLineWidth: 1
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false
        },

        plotOptions: {
            bubble: {
                minSize: 3,
                maxSize: 50,
                zMin: 0,
                zMax: 100
            }
        },

        series: [{
            data: [
                [9, 81, 6],
                [98, 5, 19],
                [51, 50, 13],
                [41, 22, 14],
                [58, 24, 20],
                [78, 37, 4],
                [55, 56, 13]
            ]
        }]

    });
});