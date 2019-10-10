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

        var chart = Highcharts
                .chart('container', {
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
                    series: [{
                        data: [25, 25, 250]
                    }]
                }),
            point = chart.series[0].points[1],
            initialPos = getCalculatedHeight(point),
            realPos,
            done = assert.async();

        point.update(200);

        realPos = getPhysicalHeight(point);
        assert.strictEqual(
            realPos,
            initialPos,
            'Time 0 - point has not started moving'
        );

        setTimeout(function () {
            assert.strictEqual(
                getPhysicalHeight(point) > realPos,
                true,
                'Time 400 - point has continued'
            );
            realPos = getPhysicalHeight(point);
        }, 400);

        setTimeout(function () {
            assert.strictEqual(
                getPhysicalHeight(point) > realPos,
                true,
                'Time 800 - point has continued'
            );

        }, 800);

        setTimeout(function () {
            assert.strictEqual(
                getPhysicalHeight(point),
                getCalculatedHeight(point),
                'Time 1200 - point has landed'
            );

            done();
        }, 1200);

        TestUtilities.lolexRunAndUninstall(clock);

    } finally {

        TestUtilities.lolexUninstall(clock);

    }

});
