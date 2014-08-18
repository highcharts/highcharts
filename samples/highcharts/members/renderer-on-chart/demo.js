$(function () {
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        yAxis: {
            max: 300
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    }, function (chart) {

        var point = chart.series[0].data[8],
            text = chart.renderer.text(
                'Max',
                point.plotX + chart.plotLeft + 10,
                point.plotY + chart.plotTop - 10
            ).attr({
                zIndex: 5
            }).add(),
            box = text.getBBox();

        chart.renderer.rect(box.x - 5, box.y - 5, box.width + 10, box.height + 10, 5)
            .attr({
                fill: '#FFFFEF',
                stroke: 'gray',
                'stroke-width': 1,
                zIndex: 4
            })
            .add();
    });
});