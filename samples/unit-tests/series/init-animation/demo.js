/* eslint func-style:0 */

QUnit.test('General aniamtion tests.', function (assert) {
    var clock = null;

    try {
        clock = TestUtilities.lolexInstall();

        var chart = Highcharts.chart('container', {
                series: [
                    {
                        data: [29.9, 71.5, 106.4, 129.2]
                    }
                ]
            }),
            newSeries,
            done = assert.async(),
            width;

        setTimeout(function () {
            newSeries = chart.addSeries({
                animation: {
                    duration: 500
                },
                data: [194.1, 95.6, 54.4, 29.9]
            });
            width = newSeries.sharedClipKey &&
                chart.sharedClips[newSeries.sharedClipKey]
                    .element.width.baseVal.value;

            assert.ok(
                width === 0,
                'Animation should run when duration is set and series is added dynamically (#14362).'
            );

            done();
        }, 100);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});

QUnit.test('Initial animation - series.clip set to false', function (assert) {
    var clock = null;

    try {
        clock = TestUtilities.lolexInstall();

        var chart = Highcharts.chart('container', {
                series: [
                    {
                        data: [1, 2],
                        clip: false,
                        animation: {
                            duration: 500
                        },
                        lineWidth: 3000
                    }
                ]
            }),
            done = assert.async(),
            width;

        setTimeout(function () {
            // animation started
            width = chart.sharedClips[chart.series[0].sharedClipKey]
                .element.width.baseVal.value;

            assert.strictEqual(
                width > 20 && width < 200,
                true,
                'Animating - plot clipped'
            );

            setTimeout(function () {
                // animation uncovers most of the plot
                width = chart.sharedClips[chart.series[0].sharedClipKey]
                    .element.width.baseVal.value;
                assert.strictEqual(
                    width > 300 && width < 600,
                    true,
                    'Animation uncovers most of the plot'
                );
            }, 300);

            setTimeout(function () {
                const clipRect = chart.sharedClips[
                    chart.series[0].sharedClipKey
                ];
                // animation finished
                assert.strictEqual(
                    // Highcharts - tested in browser
                    clipRect === undefined ||
                        // Highcharts Stock - tested in headless
                        clipRect.element.width.baseVal.value ===
                            chart.chartWidth,
                    true,
                    'Animation finished - no clip box'
                );

                // all tests are done
                done();
            }, 600);
        }, 100);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});

QUnit.test(
    'Initial animation - defer and series label test #12901',
    function (assert) {
        var clock = null;

        try {
            clock = TestUtilities.lolexInstall();

            var chart = Highcharts.chart('container', {
                    series: [
                        {
                            data: [
                                43934,
                                52503,
                                57177,
                                69658,
                                97031,
                                119931,
                                137133,
                                154175
                            ],
                            animation: {
                                defer: 200,
                                duration: 200
                            },
                            clip: false
                        }
                    ]
                }),
                done = assert.async(),
                width;

            setTimeout(function () {
                // animation started
                width = chart.sharedClips[chart.series[0].sharedClipKey]
                    .element.width.baseVal.value;

                assert.strictEqual(
                    width === 0,
                    true,
                    'Animate should not start'
                );

                setTimeout(function () {
                    // animation uncovers most of the plot
                    width = chart.sharedClips[chart.series[0].sharedClipKey]
                        .element.width.baseVal.value;
                    assert.strictEqual(
                        width > 300 && width < 600,
                        true,
                        'Animation uncovers most of the plot'
                    );
                }, 250);

                setTimeout(function () {
                    const clipRect = chart.sharedClips[
                        chart.series[0].sharedClipKey
                    ];
                    // animation finished
                    assert.strictEqual(
                        // Highcharts - tested in browser
                        clipRect === undefined ||
                            // Highcharts Stock - tested in headless
                            clipRect.element.width.baseVal.value ===
                                chart.chartWidth,
                        true,
                        'Animation finished - no clip box'
                    );

                    // all tests are done
                    done();
                }, 400);
            }, 100);

            TestUtilities.lolexRunAndUninstall(clock);
        } finally {
            TestUtilities.lolexUninstall(clock);
        }
    }
);
