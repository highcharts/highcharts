/* eslint func-style:0 */

QUnit.test('Animation duration', function (assert) {

    var clock = null;

    try {

        clock = TestUtilities.lolexInstall();

        var chart = Highcharts
            .chart('container', {

                chart: {
                    animation: {
                        duration: 1000
                    }
                },

                xAxis: {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                },

                series: [{
                    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
                }]

            }),
            point = chart.series[0].points[0],
            initialPos = point.series.yAxis.toPixels(point.y, true),
            realPos,
            done = assert.async();

        chart.series[0].points[0].update(200);

        realPos = point.graphic.attr('y') + point.graphic.attr('height') / 2;
        assert.strictEqual(
            realPos,
            initialPos,
            'Time 0 - point has not started moving'
        );

        setTimeout(function () {
            assert.strictEqual(
                point.graphic.attr('y') + point.graphic.attr('height') / 2 < realPos,
                true,
                'Time 400 - point has continued'
            );
            realPos = point.graphic.attr('y') + point.graphic.attr('height') / 2;
        }, 400);

        setTimeout(function () {
            assert.strictEqual(
                point.graphic.attr('y') + point.graphic.attr('height') / 2 < realPos,
                true,
                'Time 800 - point has continued'
            );

        }, 800);

        setTimeout(function () {
            assert.strictEqual(
                point.graphic.attr('y') + point.graphic.attr('height') / 2,
                point.series.yAxis.toPixels(point.y, true),
                'Time 1200 - point has landed'
            );

            done();
        }, 1200);

        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }

});

QUnit.test('No animation', function (assert) {

    var chart = Highcharts
        .chart('container', {

            chart: {
                animation: false
            },

            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },

            series: [{
                data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
            }]

        }),
        point = chart.series[0].points[0];

    chart.series[0].points[0].update(200);

    assert.strictEqual(
        point.graphic.attr('y') + point.graphic.attr('height') / 2,
        point.series.yAxis.toPixels(point.y, true),
        'Point is placed sync'
    );
});
