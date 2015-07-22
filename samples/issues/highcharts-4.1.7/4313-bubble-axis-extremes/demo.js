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
            }).highcharts();

        assert.strictEqual(
            chart.xAxis[0].max > chart.series[0].xData[1],
            true,
            'Proper padding for xAxis.max'
        );
        assert.strictEqual(
            chart.yAxis[0].max > chart.series[0].yData[0],
            true,
            'Proper padding for yAxis.max'
        );
    });
});