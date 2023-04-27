/* eslint func-style:0 */

QUnit.test('Point animation', function (assert) {
    var clock = null;

    function getPhysicalHeight(point) {
        return Math.round(point.graphic.front.getBBox(true).height);
    }

    function getCalculatedHeight(point) {
        return Math.round(
            point.series.yAxis.toPixels(0) -
                point.series.yAxis.toPixels(point.y)
        );
    }

    try {
        clock = TestUtilities.lolexInstall();

        var chart = Highcharts.chart('container', {
                chart: {
                    type: 'column',
                    animation: {
                        duration: 1000
                    },
                    options3d: {
                        enabled: true,
                        alpha: 0,
                        beta: 0,
                        viewDistance: 25,
                        depth: 0
                    }
                },
                plotOptions: {
                    column: {
                        depth: 0
                    }
                },
                yAxis: {
                    max: 250
                },
                series: [
                    {
                        data: [25]
                    }
                ]
            }),
            point = chart.series[0].points[0],
            initialPos = getCalculatedHeight(point),
            realPos,
            done = assert.async();

        point.update(200);

        realPos = getPhysicalHeight(point);
        assert.close(
            realPos,
            initialPos,
            1,
            'Time 0 - point should not yet have started moving'
        );

        setTimeout(function () {
            assert.strictEqual(
                getPhysicalHeight(point) > realPos,
                true,
                'Time 400 - point should have moved'
            );
            realPos = getPhysicalHeight(point);
        }, 400);

        setTimeout(function () {
            assert.strictEqual(
                getPhysicalHeight(point) > realPos,
                true,
                'Time 800 - point should have continued to move'
            );
        }, 800);

        setTimeout(function () {
            assert.strictEqual(
                getPhysicalHeight(point),
                getCalculatedHeight(point),
                'Time 1200 - point should be landed'
            );

            done();
        }, 1200);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});
