QUnit.test('RangeSelector update', function (assert) {
    const chart = Highcharts.stockChart('container', {
        chart: {
            width: 400,
            spacingBottom: 100
        },
        navigator: {
            adaptToUpdatedData: false
        },
        scrollbar: {
            enabled: false
        },
        rangeSelector: {
            selected: 3
        },
        series: [{}]
    });

    // No errors so far, with empty chart (#3487 and regression in
    // RangeSelector)

    chart.update({
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

    chart.rangeSelector.update({});

    assert.strictEqual(
        eventCount(chart),
        before,
        '#14856: It should not leak chart event listeners on update'
    );
});

QUnit.test('RangeSelector update hover', function (assert) {
    var chart = Highcharts.stockChart('container', {
        series: [{
            pointInterval: 24 * 36e5,
            pointStart: Date.UTC(2013, 0, 1),
            data: Array.from({ length: 100 }, (_, x) => Math.sin(x / 10) * 10)
        }]
    });
    const controller = new TestController(chart);
    controller.mouseEnter([100, 15], [100, 25], {});
    chart.redraw();

    assert.strictEqual(
        chart.rangeSelector.buttons[1].fill,
        '#e6e6e6',
        'Color of the button should be correct'
    );
});
