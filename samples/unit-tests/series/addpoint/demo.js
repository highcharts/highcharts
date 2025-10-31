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

            series.addPoint(5);

            let midOpacity, midX, midY;
            setTimeout(() => {
                midOpacity = series.points[4].graphic.opacity;
                midX = series.points[4].graphic.x;
                midY = series.points[4].graphic.y;
            }, 50);

            setTimeout(() => {
                assert.close(
                    midOpacity,
                    0.5,
                    0.3,
                    `The ${type} point should be semi-opaque mid entrance`
                );
                assert.ok(
                    midX > series.points[4].graphic.x,
                    `The ${type} point should slide in from the right`
                );

                if (series.is('column')) {
                    assert.strictEqual(
                        midY,
                        series.points[4].graphic.y,
                        `The ${type} point should retain y position`
                    );
                } else {
                    assert.ok(
                        midY < series.points[4].graphic.y,
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
