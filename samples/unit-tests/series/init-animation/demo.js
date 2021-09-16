/* eslint func-style:0 */

QUnit.test('General animation tests', function (assert) {
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

        const initialClips = chart.container.querySelectorAll('defs clipPath').length;
        assert.ok(
            initialClips >= 2,
            'There should be at least clips initially, one for plot area and one for the series'
        );

        setTimeout(function () {
            newSeries = chart.addSeries({
                animation: {
                    duration: 200
                },
                data: [194.1, 95.6, 54.4, 29.9]
            });

            const animationClipKey = [
                newSeries.sharedClipKey,
                200, // duration
                undefined, // easing
                0 // defer
            ].join(',');

            width = chart.sharedClips[animationClipKey]
                .element.width.baseVal.value;

            assert.strictEqual(
                width,
                0,
                'Animation should run when duration is set and series is added dynamically (#14362).'
            );
        }, 100);

        setTimeout(function () {
            assert.strictEqual(
                chart.container.querySelectorAll('defs clipPath').length,
                initialClips + 2,
                'There should be an additional two clips when animating, ' +
                'one for the line and one for markers'
            );

        }, 200);

        setTimeout(function () {
            assert.strictEqual(
                chart.container.querySelectorAll('defs clipPath').length,
                initialClips,
                'When the animation settles, the two temporary clips should ' +
                'be purged'
            );

            done();
        }, 400);

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
            const animationClipKey = [
                chart.series[0].sharedClipKey,
                500, // duration
                undefined, // easing
                0 // defer
            ].join(',');

            // animation started
            width = chart.sharedClips[animationClipKey]
                .element.width.baseVal.value;

            assert.strictEqual(
                width > 20 && width < 200,
                true,
                'Animating - plot clipped'
            );

            setTimeout(function () {
                // animation uncovers most of the plot
                width = chart.sharedClips[animationClipKey]
                    .element.width.baseVal.value;
                assert.strictEqual(
                    width > 300 && width < 600,
                    true,
                    'Animation uncovers most of the plot'
                );
            }, 300);

            setTimeout(function () {
                const clipRect = chart.sharedClips[animationClipKey];
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
                const animationClipKey = [
                    chart.series[0].sharedClipKey,
                    200, // duration
                    undefined, // easing
                    200 // defer
                ].join(',');

                // animation started
                width = chart.sharedClips[animationClipKey]
                    .element.width.baseVal.value;

                assert.strictEqual(
                    width,
                    0,
                    'Animate should not start'
                );

                setTimeout(function () {
                    // animation uncovers most of the plot
                    width = chart.sharedClips[animationClipKey]
                        .element.width.baseVal.value;
                    assert.strictEqual(
                        width > 300 && width < 600,
                        true,
                        'Animation uncovers most of the plot'
                    );
                }, 250);

                setTimeout(function () {
                    const clipRect = chart.sharedClips[
                        animationClipKey
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
