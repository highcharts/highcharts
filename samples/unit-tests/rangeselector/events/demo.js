QUnit.test('Event listener leaks', assert => {
    const chart = Highcharts.stockChart('container', {
        series: [
            {
                data: [1, 2, 3]
            }
        ]
    });

    const eventCount = el => {
        let count = 0;
        //eslint-disable-next-line
        for (const t in el.hcEvents) {
            count += el.hcEvents[t].length;
        }
        return count;
    };

    const before = eventCount(chart);

    chart.rangeSelector.update();

    assert.strictEqual(
        eventCount(chart),
        before,
        'It should not leak chart event listeners on update'
    );
});