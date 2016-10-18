$(function () {

    QUnit.test('Soft threshold', function (assert) {
        var chart,
            $container = $('#container');

        $container.highcharts({
            series: [{
                data: [1001, 1002, 1003]
            }]
        });

        chart = $container.highcharts();


        assert.strictEqual(
            chart.yAxis[0].min > 0,
            true,
            'Line - high dangling data'
        );

        chart.series[0].setData([0, 1, 2], true, false);
        assert.strictEqual(
            chart.yAxis[0].min,
            0,
            'Line - tight positive data'
        );

        chart.series[0].setData([-1, 0, 1, 2], true, false);
        assert.strictEqual(
            chart.yAxis[0].min < 0,
            true,
            'Line - crossing threshold'
        );

        chart.series[0].setData([0, -1, -2], true, false);
        assert.strictEqual(
            chart.yAxis[0].max,
            0,
            'Line - tight negative data'
        );

        chart.series[0].setData([-1000, -1001, -1002], true, false);
        assert.strictEqual(
            chart.yAxis[0].max < 0,
            true,
            'Line - low dangling data'
        );


        chart.series[0].update({ type: 'area' });
        chart.series[0].setData([1001, 1002, 1003]);


        assert.strictEqual(
            chart.yAxis[0].getExtremes().dataMin,
            1001,
            'Area dataMin (#985)'
        );

        assert.strictEqual(
            chart.yAxis[0].min,
            0,
            'Area - high dangling data'
        );

        chart.series[0].setData([0, 1, 2], true, false);
        assert.strictEqual(
            chart.yAxis[0].min,
            0,
            'Area - tight positive data'
        );

        chart.series[0].setData([-1, 0, 1, 2], true, false);
        assert.strictEqual(
            chart.yAxis[0].min < 0,
            true,
            'Area - crossing threshold'
        );

        chart.series[0].setData([0, -1, -2], true, false);
        assert.strictEqual(
            chart.yAxis[0].max,
            0,
            'Area - tight negative data'
        );

        chart.series[0].setData([-1000, -1001, -1002], true, false);
        assert.strictEqual(
            chart.yAxis[0].max,
            0,
            'Area - low dangling data'
        );



        chart.series[0].setData([1001, 1002, 1003]);
        chart.addSeries({
            type: 'line',
            data: [1001, 1002, 1003]
        });
        assert.strictEqual(
            chart.yAxis[0].min,
            0,
            'Combined - high dangling data'
        );
    });

    QUnit.test('Soft threshold = false', function (assert) {
        var chart,
            $container = $('#container');


        // Tests for softThreshold: false
        $container.highcharts({
            series: [{
                data: [1001, 1002, 1003],
                softThreshold: false
            }]
        });

        chart = $container.highcharts();
        assert.strictEqual(
            chart.yAxis[0].min > 0,
            true,
            'Line - high dangling data'
        );

        chart.series[0].setData([0, 1, 2], true, false);
        assert.strictEqual(
            chart.yAxis[0].min < 0,
            true,
            'Line - tight positive data'
        );


    });
});