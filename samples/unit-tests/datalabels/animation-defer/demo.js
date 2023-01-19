QUnit.test('Initial animation - defer test #12901', function (assert) {
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
                            defer: 100,
                            duration: 100
                        },
                        dataLabels: {
                            enabled: true,
                            defer: true
                        }
                    },
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
                        ].reverse(),
                        animation: {
                            duration: 100
                        },
                        dataLabels: {
                            defer: true,
                            enabled: true,
                            animation: {
                                defer: 400
                            }
                        }
                    },
                    {
                        data: [43934, 52503, 57177, 69658].reverse(),
                        dataLabels: {
                            enabled: true,
                            defer: false
                        }
                    }
                ]
            }),
            done = assert.async(),
            dlOpacity = chart.series[2].dataLabelsGroup.attr('opacity');

        // defer false - label should be visible immediately
        assert.strictEqual(
            dlOpacity === 1,
            true,
            'Animate should be finished - dataLabels should be visible'
        );

        setTimeout(function () {
            // animation started
            dlOpacity = chart.series[0].dataLabelsGroup.attr('opacity');
            assert.strictEqual(
                dlOpacity === 0,
                true,
                'Animate should not be started - dataLabels should be invisible'
            );

            setTimeout(function () {
                dlOpacity = chart.series[0].dataLabelsGroup.attr('opacity');
                // animation finished
                assert.strictEqual(
                    dlOpacity === 1,
                    true,
                    'Animate should be finished - dataLabels should be visible'
                );
                // check second series with fixed defer time
                dlOpacity = chart.series[1].dataLabelsGroup.attr('opacity');
                assert.strictEqual(
                    dlOpacity === 0,
                    true,
                    'Animate should not be started - dataLabels should be invisible'
                );
            }, 150);

            setTimeout(function () {
                dlOpacity = chart.series[1].dataLabelsGroup.opacity;
                // animation finished
                assert.strictEqual(
                    dlOpacity === 1,
                    true,
                    'Animate should be finished - dataLabels should be visible'
                );
                // all tests are done
                done();
            }, 500);
        }, 100);

        TestUtilities.lolexRunAndUninstall(clock);
    } finally {
        TestUtilities.lolexUninstall(clock);
    }
});
