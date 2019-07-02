/* eslint func-style:0 */

QUnit.test('Initial animation - series.clip set to false', function (assert) {

    var clock = null;

    try {
        clock = TestUtilities.lolexInstall();

        var chart = Highcharts.chart('container', {
                series: [{
                    data: [1, 2],
                    clip: false,
                    animation: {
                        duration: 500
                    },
                    lineWidth: 3000
                }]
            }),
            done = assert.async(),
            width;

        setTimeout(function () {
            // animation started
            width = chart[chart.series[0].sharedClipKey].element.width.baseVal
                .value;

            assert.strictEqual(
                width > 20 && width < 200,
                true,
                'Animating - plot clipped'
            );

            setTimeout(function () {
                // animation uncovers most of the plot
                width = chart[chart.series[0].sharedClipKey].element.width
                    .baseVal.value;
                assert.strictEqual(
                    width > 300 && width < 600,
                    true,
                    'Animation uncovers most of the plot'
                );
            }, 300);

            setTimeout(function () {
                // animation finished
                assert.strictEqual(
                    // Highcharts - tested in browser
                    chart[chart.series[0].sharedClipKey] === undefined ||
                    // Highstock - tested in headless
                    chart[chart.series[0].sharedClipKey].element.width
                        .baseVal.value === chart.chartWidth,
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
