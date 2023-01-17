QUnit.test('Fullscreen module.', function (assert) {
    var chart = Highcharts.chart('container', {
        series: [
            {
                data: [5, 3, 4, 2, 4, 3]
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

    const before = eventCount(chart);

    chart.fullscreen.open();
    chart.fullscreen.close();

    assert.strictEqual(
        eventCount(chart),
        before,
        'It should not leak event listeners'
    );

    assert.ok(true, 'Chart displayed in fullscreen mode without any errors.');
});
