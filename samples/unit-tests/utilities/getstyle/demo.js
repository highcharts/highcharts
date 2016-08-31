$(function () {


    QUnit.test('Container with box-sizing', function (assert) {
        var chart = Highcharts.chart('container-box-size', {
            series: [{
                data: [1, 3, 2, 4]
            }]
        });

        assert.strictEqual(
            chart.chartWidth,
            360,
            'Chart width is inner box'
        );

        assert.strictEqual(
            chart.chartHeight,
            260,
            'Chart height is inner box'
        );

    });

    QUnit.test('Container with overflow:auto', function (assert) {
        var chart = Highcharts.chart('container-overflow', {
            series: [{
                data: [1, 3, 2, 4]
            }]
        });

        assert.strictEqual(
            chart.chartWidth,
            200,
            'Chart width is inner box'
        );

        assert.strictEqual(
            chart.chartHeight,
            200,
            'Chart height is inner box'
        );

    });

});