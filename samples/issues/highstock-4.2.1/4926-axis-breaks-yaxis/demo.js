$(function () {
    QUnit.test('Axis breaks on Y axis', function (assert) {
        var chart = Highcharts.chart('container', {
            yAxis: {
                breaks: [{
                    from: 50,
                    to: 100,
                    breakSize: 0
                }]
            },
            series: [{ data: [0, 49, 101, 150] }]
        });

        assert.strictEqual(
            typeof chart.yAxis[0].toPixels(50),
            'number',
            'Axis to pixels ok'
        );
        assert.strictEqual(
            chart.yAxis[0].toPixels(50),
            chart.yAxis[0].toPixels(100),
            '50 and 100 translate to the same axis position'
        );
    });
});