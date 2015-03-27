$(function () {
    $('#container').highcharts({

        title: {
            text: 'Highcharts custom label'
        },

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    }, function (chart) { // on complete
        var point = chart.series[0].points[8];
        chart.renderer.label('Max observation', 270, 50, 'callout', point.plotX + chart.plotLeft, point.plotY + chart.plotTop)
            .css({
                color: '#FFFFFF'
            })
            .attr({
                fill: 'rgba(0, 0, 0, 0.75)',
                padding: 8,
                r: 5,
                zIndex: 6
            })
            .add();

    });
});