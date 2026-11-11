QUnit.test('Add point with entrance animation', assert => {
    let clock;
    try {
        clock = TestUtilities.lolexInstall();

        const chart = Highcharts.chart('container', {
            chart: {
                width: 600,
                height: 400,
                animation: {
                    duration: 100
                }
            }
        });

        const types = [
            'line',
            'column',
            // Bubble disabled due to failures on CI server. Local tests OK.
            // 'bubble',
            'candlestick'
        ];

        const shiftAndRun = () => {
            const type = types.shift();

            if (!type) {
                return;
            }

            const data = type === 'candlestick' ?
                [
                    [1, 2, 0.5, 1.5],
                    [3, 4, 2.5, 3.5],
                    [2, 3, 1.5, 2.5],
                    [4, 5, 3.5, 4.5]
                ] :
                [1, 3, 2, 4];


            const series = chart.addSeries({
                type,
                data,
                dataLabels: {
                    enabled: true,
                    format: '{y}'
                }
            }, true, false);

            assert.strictEqual(
                chart.series[0].type,
                type,
                `The ${type} should be added`
            );

            const condemnedPoint = series.points[0],
                condemnedPointX = condemnedPoint.graphic.getBBox().x,
                condemnedDataLabelX = condemnedPoint.dataLabel.x;

            const newValue = type === 'candlestick' ? [5, 6, 4.5, 5.5] : 5;
            series.addPoint(newValue, true, true);
            const newPoint = series.points[3];

            let graphicMidOpacity,
                graphicMidX,
                graphicMidY,
                dlMidOpacity,
                dlMidX,
                dlMidY;
            setTimeout(() => {

                if (!newPoint.graphic) {
                    assert.ok(
                        false,
                        `The ${type} new point graphic should exist ` +
                        'halfway through entrance animation'
                    );
                    return;
                }
                graphicMidOpacity = newPoint.graphic.opacity;
                graphicMidX = newPoint.graphic.getBBox().x;
                graphicMidY = newPoint.graphic.getBBox().y;
                dlMidOpacity = newPoint.dataLabel.opacity;
                dlMidX = newPoint.dataLabel.x;
                dlMidY = newPoint.dataLabel.y;

                assert.close(
                    condemnedPoint.graphic.opacity,
                    0.5,
                    0.3,
                    `The ${type} condemned point should be semi-opaque mid exit`
                );

                assert.ok(
                    condemnedPoint.graphic.getBBox().x < condemnedPointX,
                    `The ${type} condemned point should slide out to the left`
                );

                assert.notEqual(
                    condemnedPoint.graphic.attr('visibility'),
                    'hidden',
                    `The ${type} condemned point graphic should not be hidden`
                );

                assert.close(
                    condemnedPoint.dataLabel.opacity,
                    0.5,
                    0.3,
                    `The ${type} condemned data label should be semi-opaque`
                );

                assert.ok(
                    condemnedPoint.dataLabel.x < condemnedDataLabelX - 10,
                    `The ${type} condemned data label should slide out`
                );
            }, 50);

            setTimeout(() => {

                // Point graphic
                assert.close(
                    graphicMidOpacity,
                    0.5,
                    0.3,
                    `The ${type} point should be semi-opaque mid entrance`
                );

                if (!newPoint.graphic) {
                    assert.ok(
                        false,
                        `The ${type} new point graphic should exist ` +
                        'at the end of the animation'
                    );
                    return;
                }

                assert.ok(
                    graphicMidX > newPoint.graphic.getBBox().x,
                    `The ${type} point should slide in from the right`
                );

                if (series.is('column')) {
                    assert.strictEqual(
                        graphicMidY,
                        newPoint.graphic.getBBox().y,
                        `The ${type} point should retain y position`
                    );
                } else {
                    assert.ok(
                        graphicMidY < newPoint.graphic.getBBox().y,
                        `The ${type} point should slide in from the top`
                    );
                }

                // Data label
                assert.close(
                    dlMidOpacity,
                    0.5,
                    0.3,
                    `The ${type} point label should be semi-opaque mid ` +
                    'entrance'
                );
                assert.ok(
                    dlMidX > newPoint.dataLabel.x,
                    `The ${type} point label should slide in from the right`
                );

                if (series.is('column')) {
                    assert.strictEqual(
                        dlMidY,
                        newPoint.dataLabel.y,
                        `The ${type} point label should retain y position`
                    );
                } else {
                    assert.ok(
                        dlMidY < newPoint.dataLabel.y,
                        `The ${type} point label should slide in from the top`
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

QUnit.test('Chart.update with entrance animation', assert => {
    let clock;
    try {
        clock = TestUtilities.lolexInstall();

        const chart = Highcharts.chart('container', {
            series: [{
                data: [
                    [0, 1],
                    [1, 3],
                    [2, 2],
                    [3, 4]
                ],
                type: 'column'
            }]
        });

        const exitingPoint = chart.series[0].points[0];

        chart.update({
            series: [{
                data: [
                    [1, 3],
                    [2, 2],
                    [3, 4],
                    [4, 1]
                ]
            }]
        }, true, true, { duration: 2000 });

        const enteringPoint = chart.series[0].points[3];

        setTimeout(() => {
            // Testing with long animation because the point was destroyed
            // before the animation was finished
            assert.close(
                exitingPoint.graphic.opacity,
                0.5,
                0.3,
                'The old point should be semi-opaque mid exit'
            );
            assert.close(
                enteringPoint.graphic.opacity,
                0.5,
                0.3,
                'The new point should be semi-opaque mid entrance'
            );
        }, 1000);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});

QUnit.test('Set extremes with entrance and exit animations', assert => {
    let clock;
    try {
        clock = TestUtilities.lolexInstall();

        const chart = Highcharts.chart('container', {
            chart: {
                animation: {
                    duration: 100
                }
            },
            plotOptions: {
                series: {
                    minRange: 1
                }
            }
        });

        const types = [
            'line',
            'column',
            'bubble',
            'candlestick'
        ];

        const shiftAndRun = () => {
            const type = types.shift();

            if (!type) {
                return;
            }

            chart.series[0]?.remove();
            chart.xAxis[0].setExtremes(undefined, undefined, true, false);

            const data = type === 'candlestick' ?
                [
                    [1, 2, 0.5, 1.5],
                    [3, 4, 2.5, 3.5],
                    [2, 3, 1.5, 2.5],
                    [4, 5, 3.5, 4.5],
                    [5, 6, 4.5, 5.5],
                    [4, 5, 3.5, 4.5],
                    [3, 4, 2.5, 3.5],
                    [4, 5, 3.5, 4.5]
                ] :
                [1, 3, 2, 4, 5, 4, 3, 4];

            const series = chart.addSeries({
                type,
                data,
                dataLabels: {
                    enabled: true,
                    format: '{y}'
                }
            }, true, false);

            assert.strictEqual(
                chart.series[0].type,
                type,
                `The ${type} should be added`
            );

            const firstPoint = series.points[0],
                firstPointX = firstPoint.graphic.getBBox().x,
                firstDataLabelX = firstPoint.dataLabel.x;

            series.xAxis.setExtremes(2, 6);

            setTimeout(() => {
                // Columns don't fade out, the're clipped
                if (!series.is('column')) {
                    assert.close(
                        firstPoint.graphic.opacity,
                        0.5,
                        0.3,
                        `The ${type} outgoing point should be semi-opaque ` +
                        'mid exit'
                    );
                }

                assert.ok(
                    firstPoint.graphic.getBBox().x < firstPointX,
                    `The ${type} outgoing point should slide out to the left`
                );

                assert.notEqual(
                    firstPoint.graphic.attr('visibility'),
                    'hidden',
                    `The ${type} outgoing point graphic should not be hidden`
                );

                assert.close(
                    firstPoint.dataLabel.opacity,
                    0.5,
                    0.3,
                    `The ${type} outgoing data label should be semi-opaque`
                );

                assert.ok(
                    firstPoint.dataLabel.x < firstDataLabelX,
                    `The ${type} outgoing data label should slide out`
                );
            }, 50);

            setTimeout(() => {

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

QUnit.test(
    'Removed pie slices shrink in place and fade out with their labels ' +
    '(#25504)',
    assert => {
        let clock;
        try {
            clock = TestUtilities.lolexInstall();

            const data = [
                    { id: 'a', y: 10 },
                    { id: 'b', y: 20 },
                    { id: 'c', y: 30 },
                    { id: 'd', y: 25 },
                    { id: 'e', y: 15 }
                ],
                chart = Highcharts.chart('container', {
                    chart: {
                        animation: {
                            duration: 100
                        }
                    },
                    series: [{
                        type: 'pie',
                        data
                    }]
                }),
                series = chart.series[0],
                [a, b, c, d] = series.points;

            series.setData([data[0], data[2], data[4]]);

            assert.deepEqual(
                [b, d].map(p => [p.shapeArgs.start, p.shapeArgs.end]),
                [a, c].map(p => [p.shapeArgs.end, p.shapeArgs.end]),
                'The removed slices should shrink into zero-width slices ' +
                'in place'
            );

            setTimeout(() => {
                assert.close(
                    b.graphic.opacity,
                    0.5,
                    0.3,
                    'The removed slice should be semi-opaque mid exit'
                );

                assert.close(
                    b.dataLabel.opacity,
                    0.5,
                    0.3,
                    'The removed data label should be semi-opaque mid exit'
                );

                assert.close(
                    b.dataLabel.connector.opacity,
                    0.5,
                    0.3,
                    'The removed connector should be semi-opaque mid exit'
                );
            }, 50);

            TestUtilities.lolexRunAndUninstall(clock);
        } finally {
            TestUtilities.lolexUninstall(clock);
        }
    }
);
