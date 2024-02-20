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

function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

QUnit.test('#20548, chart resizing after fullscreen.', async function (assert) {
    var done = assert.async();
    var chart = Highcharts.chart('container', {
        series: [
            {
                data: [5, 3, 4, 2, 4, 3]
            }
        ]
    });
    const oldChartWidth = chart.chartWidth;
    const oldXAxisLength = chart.axes[0].len;

    chart.fullscreen.open();
    chart.fullscreen.close();
    // Wait a bit for firefox to close the fullscreen mode.
    await sleep(500);

    // Simulates a container resize, e.g. like a window resize.
    chart.container.parentElement.style.width = '300px';
    // Let the browser update styles.
    await sleep(500);

    assert.ok(chart.chartWidth < oldChartWidth, 'Chart width should be smaller after resizing.');
    assert.ok(chart.axes[0].len < oldXAxisLength, 'X-axis length should should be smaller after resizing.');
    assert.ok(chart.axes[0].len < chart.chartWidth, 'X-axis length should should be smaller than the chart width after resizing.');
    assert.strictEqual(chart.isResizing, 0, 'Chart should be done resizing.');
    done();
});