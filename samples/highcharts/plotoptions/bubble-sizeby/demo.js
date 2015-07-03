$(function () {
    $('#container').highcharts({

        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zoomType: 'xy'
        },

        title: {
            text: 'Highcharts Bubbles Sizing'
        },
        subtitle: {
            text: 'Smallest and largest bubbles are equal, intermediate bubbles different.'
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
                [1, 1, 1],
                [2, 2, 2],
                [3, 3, 3],
                [4, 4, 4],
                [5, 5, 5]
            ],
            sizeBy: 'area',
            name: 'Size by area'
        }, {
            data: [
                [1, 1, 1],
                [2, 2, 2],
                [3, 3, 3],
                [4, 4, 4],
                [5, 5, 5]
            ],
            sizeBy: 'width',
            name: 'Size by width'
        }]

    });
});