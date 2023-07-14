QUnit.test('RangeSelector update', function (assert) {
    var chart = Highcharts.stockChart('container', {
        chart: {
            width: 400,
            spacingBottom: 100
        },
        rangeSelector: {
            enabled: false
        },

        series: [
            {
                data: [1, 2, 10, 10]
            }
        ]
    });

    const plotTop = chart.plotTop;

    chart.update({
        rangeSelector: {
            enabled: true
        }
    });

    assert.ok(chart.rangeSelector, 'chart.rangeSelector should be set');

    assert.strictEqual(
        chart.spacing[2],
        100,
        '#7684: spacingBottom should not be ignored on update'
    );

    assert.ok(
        chart.plotTop > plotTop,
        '#11669: plotTop should have increased to make room for range selector'
    );
    assert.ok(
        chart.rangeSelector.minDateBox.text.textStr,
        '#11669: dateBox text should be set'
    );

    const eventCount = el => {
        let count = 0;
        // eslint-disable-next-line
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
        '#14856: It should not leak chart event listeners on update'
    );
});
