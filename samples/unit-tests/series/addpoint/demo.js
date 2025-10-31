QUnit.test('Add point with entrance animation', assert => {
    let clock;
    try {
        clock = TestUtilities.lolexInstall();

        const chart = Highcharts.chart('container', {
            chart: {
                animation: {
                    duration: 100
                }
            }
        });

        const types = [
            'line',
            'column',
            'bubble'
        ];

        const shiftAndRun = () => {
            const type = types.shift();

            if (!type) {
                return;
            }

            const series = chart.addSeries({
                type,
                data: [1, 3, 2, 4]
            }, true, false);

            assert.strictEqual(
                chart.series[0].type,
                type,
                `The ${type} should be added`
            );

            const condemnedPoint = series.points[0],
                condemnedPointX = condemnedPoint.graphic.x;

            series.addPoint(5, true, true);
            const newPoint = series.points[3];

            let midOpacity, midX, midY;
            setTimeout(() => {
                midOpacity = newPoint.graphic.opacity;
                midX = newPoint.graphic.x;
                midY = newPoint.graphic.y;

                assert.close(
                    condemnedPoint.graphic.opacity,
                    0.5,
                    0.3,
                    `The ${type} condemned point should be semi-opaque mid exit`
                );

                assert.ok(
                    condemnedPoint.graphic.x < condemnedPointX,
                    `The ${type} condemned point should slide out to the left`
                );
            }, 50);

            setTimeout(() => {
                assert.close(
                    midOpacity,
                    0.5,
                    0.3,
                    `The ${type} point should be semi-opaque mid entrance`
                );
                assert.ok(
                    midX > newPoint.graphic.x,
                    `The ${type} point should slide in from the right`
                );

                if (series.is('column')) {
                    assert.strictEqual(
                        midY,
                        newPoint.graphic.y,
                        `The ${type} point should retain y position`
                    );
                } else {
                    assert.ok(
                        midY < newPoint.graphic.y,
                        `The ${type} point should slide in from the top`
                    );
                }

                if (types.length > 0) { // Keep the last for visual inspection
                    series.remove();
                }

                // Next type
                shiftAndRun();
            }, 150);

        };

        shiftAndRun();

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});
