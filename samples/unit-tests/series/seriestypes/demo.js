Object.keys(Highcharts.Series.types).forEach(function (type) {
    if (
        // Don't test indicator series (yet), they have more complex setup
        !('linkedTo' in Highcharts.defaultOptions.plotOptions[type]) &&
        // Complains about a missing axis
        type !== 'scatter3d'
    ) {
        QUnit.test(
            `No errors in the console during initialization with no data for
            ${type} series.`,
            assert => {
                const chart = Highcharts.chart('container', {
                    chart: {
                        type: type
                    }
                });

                assert.ok(
                    true,
                    'No errors in console when series is not declared.'
                );

                chart.addSeries({
                    name: 'Test series'
                });

                assert.ok(
                    true,
                    'No errors in console after adding empty series.'
                );

                chart.series[0].update({
                    data: []
                });

                assert.ok(
                    true,
                    'No errors in console after updating series with empty data.'
                );
            }
        );
    }
});

QUnit.test('#13277: Event listener memory leak', assert => {
    Object.keys(Highcharts.Series.types).forEach(type => {
        if (
            !('linkedTo' in Highcharts.defaultOptions.plotOptions[type]) &&
            type !== 'scatter3d' &&
            type !== 'map' &&
            type !== 'mapline' // Transform error on redraw
        ) {
            const chart = Highcharts.chart('container', {
                chart: {
                    type: type
                },
                series: [
                    {
                        name: 'Test series'
                    }
                ]
            });

            const eventCount = el => {
                let count = 0;
                // eslint-disable-next-line
                for (const t in el.hcEvents) {
                    count += el.hcEvents[t].length;
                }
                return count;
            };

            const before = eventCount(chart.series[0]);
            const beforeChart = eventCount(chart);

            chart.series[0].update({
                data: []
            });

            assert.strictEqual(
                eventCount(chart.series[0]),
                before,
                `${type} update() should not leak into series.hcEvents`
            );
            assert.strictEqual(
                eventCount(chart),
                beforeChart,
                `${type} update() should not leak into chart.hcEvents`
            );
        }
    });
});
