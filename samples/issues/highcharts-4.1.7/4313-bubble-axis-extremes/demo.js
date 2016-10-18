$(function () {
    QUnit.test('Distinct min and max for bubble padding.', function (assert) {
        var chart = $('#container').highcharts({
                chart: {
                    type: 'bubble'
                },
                xAxis: {
                    gridLineWidth: 1,
                    min: 0
                },
                yAxis: {
                    startOnTick: false,
                    endOnTick: false,
                    min: 0
                },
                series: [{
                    data: [
                        [9, 81, 63],
                        [98, 10, 189],
                        [51, 50, 73],
                        [41, 22, 14]
                    ]
                }]
            }).highcharts(),
            topPoint = chart.series[0].points[0],
            rightPoint = chart.series[0].points[1];

        assert.strictEqual(
             parseFloat(topPoint.graphic.attr("cy")) > parseFloat(topPoint.graphic.attr("r")),
            true,
            'Proper padding for yAxis.max'
        );
        assert.strictEqual(
            chart.plotWidth > parseFloat(rightPoint.graphic.attr("cx")) + parseFloat(rightPoint.graphic.attr("r")),
            true,
            'Proper padding for xAxis.max'
        );
    });
});