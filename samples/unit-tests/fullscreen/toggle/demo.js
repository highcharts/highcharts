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

QUnit.test('#20548, chart resizing after fullscreen.', async function (assert) {
    // Time out after 500ms. Fail safe in case endRisize event is not triggered.
    assert.timeout(500);

    const done = assert.async(),
        chart = Highcharts.chart('container', {
            series: [{ data: [5, 3, 4, 2, 4, 3] }]
        }),
        oldChartWidth = chart.chartWidth,
        oldXAxisLength = chart.axes[0].len;

    chart.fullscreen.open();
    chart.fullscreen.close();

    // Simulates a container resize, e.g. like a window resize.
    chart.container.parentElement.style.width = '300px';

    Highcharts.addEvent(chart, 'endResize', function () {
        assert.ok(
            chart.chartWidth < oldChartWidth,
            'Chart width should be smaller after resizing.'
        );
        assert.ok(
            chart.axes[0].len < oldXAxisLength,
            'X-axis length should be smaller after resizing.'
        );
        assert.ok(
            chart.axes[0].len < chart.chartWidth,
            'X-axis length should be smaller than chart width after resizing.'
        );
        assert.strictEqual(
            chart.isResizing,
            0,
            'Chart should be done resizing.'
        );
        done();
    });
});