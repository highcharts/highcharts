$(function () {
    QUnit.test('Distinct min and max for bubble padding.', function (assert) {
        var chart = $('#container').highcharts({
                chart: {
                    type: 'bubble',
                    zoomType: 'xy'
                },
                yAxis: {
                    min: 0,
                    max: 7,
                    categories: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
                },
                series: [{
                    data: [[1, 2, 79], [2, 3, 60], [3, 2, 58], [6, 4, 56]]
                }]
            }).highcharts();

        chart.yAxis[0].zoom(-0.5, 3);
        chart.redraw(false);

        assert.strictEqual(
            chart.yAxis[0].min,
            chart.yAxis[0].options.min,
            "Minimum don' go below yAxis.options.min"
        );
    });
});