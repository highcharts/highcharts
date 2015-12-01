$(function () {
    QUnit.test('Missing minor tick lines before and after extremes for a column chart.', function (assert) {
        var chart = $('#container').highcharts({
                xAxis: {
                    minorTickInterval: 1 // easier for tests - otherwise floating numbers in JS gives error, for example: 0.9-0.3 = 0.6000000001 etc. but we need to test strict numbers
                },
                series: [{
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
                    pointInterval: 10,
                    type: 'column'
                }]
            }).highcharts(),
            minorTicks = chart.xAxis[0].minorTicks,
            firstTick = minorTicks['-10'],
            lastTick = minorTicks['120'],
            UNDEFINED;

        assert.strictEqual(
            firstTick !== UNDEFINED && firstTick.gridLine !== UNDEFINED && firstTick.gridLine.element instanceof SVGElement,
            true,
            "Proper first minor tick."
        );
        assert.strictEqual(
            lastTick !== UNDEFINED && lastTick.gridLine !== UNDEFINED && lastTick.gridLine.element instanceof SVGElement,
            true,
            "Proper last minor tick."
        );
    });
});