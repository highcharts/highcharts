QUnit.test('Series label', function (assert) {
    let formatterCtx;

    const chart = Highcharts.chart('container', {
        chart: {
            width: 400
        },
        series: [
            {
                data: [1, 3, 2, 4],
                label: {
                    enabled: true
                }
            },
            {
                data: [1, 3, 2, 4],
                label: {
                    enabled: true,
                    format: 'Format {name}',
                    formatter: function () {
                        return 'Formatter ' + this.name;
                    }
                }
            },
            {
                data: [1, 3, 2, 4],
                label: {
                    enabled: true,
                    formatter: ctx => {
                        formatterCtx = ctx;
                        return 'Formatter ' + ctx.name;
                    }
                }
            }
        ]
    });

    assert.strictEqual(
        chart.series[0].labelBySeries.text.textStr,
        'Series 1',
        'Default series label should be series name'
    );

    assert.strictEqual(
        chart.series[1].labelBySeries.text.textStr,
        'Format Series 2',
        'Series label with format should take precedence'
    );

    assert.strictEqual(
        chart.series[2].labelBySeries.text.textStr,
        'Formatter Series 3',
        'Series label with formatter'
    );

    assert.strictEqual(
        formatterCtx,
        chart.series[2],
        'Series label formatter got series ctx as the last argument'
    );
});

QUnit.test(
    'Series label survives frequent empty chart.update({}) calls (#24805)',
    function (assert) {
        let clock;

        try {
            clock = TestUtilities.lolexInstall();

            const chart = Highcharts.chart('container', {
                chart: {
                    animation: {
                        duration: 300
                    }
                },
                series: [
                    {
                        name: 'Revenue',
                        data: [4, 2, 1, 3, 5],
                        label: {
                            enabled: true
                        }
                    }
                ]
            });

            // Updates faster than the series-label redraw debounce.
            const interval = setInterval(() => chart.update({}), 100);
            clock.tick(650);
            clearInterval(interval);

            assert.ok(
                chart.series[0].labelBySeries,
                'Series label should be drawn, not indefinitely deferred by ' +
                'empty chart.update({}) calls'
            );
        } finally {
            TestUtilities.lolexUninstall(clock);
        }
    }
);
