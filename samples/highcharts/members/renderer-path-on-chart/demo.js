$(function () {
    $('#container').highcharts({

        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },

        series: [{
            data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
        }]

    }, function (chart) { // on complete

        chart.renderer.path(['M', 0, 0, 'L', 100, 100, 200, 50, 300, 100])
            .attr({
                'stroke-width': 2,
                stroke: 'red'
            })
            .add();

    });
});