QUnit.module('Error reporting demo', () => {
    QUnit.test('point count mismatch', assert => {
        const chart = Highcharts.chart('container', {
            series: [{ data: [2, 4, 6] }]
        });

        assert.strictEqual(
            chart.series[0].points.length,
            4,
            'Expected four points after loading the series'
        );
    });

    QUnit.test('rejected data request', async () => {
        await Promise.reject(new Error('Demo data request failed'));
    });
});
