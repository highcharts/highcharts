/* eslint func-style:0 */

QUnit.skip('Initial animation - series.clip set to false', function (assert) {

    var clock = null;

    try {
        clock = TestUtilities.lolexInstall();

        var ttCounter = 0,
            chart = Highcharts.chart('container', {
                tooltip: {
                    formatter: function () {
                        ttCounter++;
                        return 'Tooltip';
                    }
                },
                series: [{
                    data: [1, 2],
                    clip: false,
                    animation: {
                        duration: 500
                    },
                    lineWidth: 3000
                }]
            }),
            controller = TestController(chart),
            done = assert.async(),
            width;

        setTimeout(function () {
            // animation started

            controller.mouseMove(150, 5);
            width = chart[chart.series[0].sharedClipKey].getBBox().width;
            assert.strictEqual(
                width > 20 && width < 200,
                true,
                'Animating - plot clipped'
            );
            assert.strictEqual(
                ttCounter,
                0,
                'Animating - no tooltip, clipped durring animation'
            );

            setTimeout(function () {
                // animation uncovers most of the plot

                controller.mouseMove(150, 5);
                assert.strictEqual(
                    ttCounter,
                    1,
                    'Animating - tooltip, the clip-rect is now big enough'
                );
            }, 300);

            setTimeout(function () {
                // animation finished

                controller.mouseMove(550, 5);
                assert.strictEqual(
                    ttCounter,
                    2,
                    'Animation finished - tooltip shown, the plot not clipped'
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
