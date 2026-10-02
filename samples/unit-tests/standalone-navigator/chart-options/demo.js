QUnit.test('Chart options in Standalone Navigator', function (assert) {
    const navigator = Highcharts.navigator('container', {
        chartOptions: {
            chart: {
                height: 250
            },
            credits: {
                enabled: false
            }
        },
        height: 60,
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.notOk(
        navigator.navigator.chart.credits,
        'Credits should not exist.'
    );

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        250,
        'Chart height from chartOptions should size the container, #24715.'
    );

    assert.strictEqual(
        navigator.navigator.height,
        60,
        'Navigator height should be independent from chart height, #24715.'
    );

    navigator.update({
        height: 80
    });

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        250,
        'Explicit chart height should be kept after height update, #24715.'
    );

    assert.strictEqual(
        navigator.navigator.height,
        80,
        'Navigator height should be updated independently, #24715.'
    );

    navigator.update({
        chartOptions: {
            chart: {
                inverted: true
            }
        }
    });

    assert.ok(
        navigator.navigator.chart.inverted,
        'Standalone navigator chart should be inverted after chart update.'
    );

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        250,
        'Chart height should be kept after inverting, #24715.'
    );

    assert.strictEqual(
        navigator.navigator.height,
        80,
        'Navigator height should be kept after inverting, #24715.'
    );

    navigator.update({
        chartOptions: {
            chart: {
                inverted: false
            }
        }
    });

    assert.notOk(
        navigator.navigator.chart.inverted,
        'Standalone navigator chart should be back to normal orientation.'
    );

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        250,
        'Chart height should be restored after turning inverted off, #24714.'
    );

    assert.strictEqual(
        navigator.navigator.height,
        80,
        'Navigator height should survive the round trip, #24714.'
    );

    assert.ok(
        navigator.navigator.scrollbar,
        'Scrollbar should be enabled by default.'
    );

    navigator.destroy();

    const noScrollbar = Highcharts.navigator('container', {
        chartOptions: {
            scrollbar: {
                enabled: false
            }
        },
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.strictEqual(
        noScrollbar.navigator.chart.container
            .querySelectorAll('.highcharts-scrollbar').length,
        0,
        'No scrollbar should be rendered when disabled, #24714.'
    );

    assert.ok(
        noScrollbar.navigator.navigatorEnabled,
        'The navigator itself should stay enabled, #24714.'
    );
});

QUnit.test('Deprecated chart option in Standalone Navigator', function (
    assert
) {
    const navigator = Highcharts.navigator('container', {
        chart: {
            chart: {
                height: 250
            },
            credits: {
                enabled: false
            }
        },
        series: [{
            data: [1, 2, 3, 4]
        }]
    });

    assert.notOk(
        navigator.navigator.chart.credits,
        'Deprecated chart option should still be applied, #24715.'
    );

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        250,
        'Deprecated chart option should still set the chart height, #24715.'
    );

    navigator.update({
        chart: {
            chart: {
                height: 300
            }
        },
        chartOptions: {
            chart: {
                height: 350
            }
        }
    });

    assert.strictEqual(
        navigator.navigator.chart.container.offsetHeight,
        350,
        'chartOptions should take precedence over the deprecated chart ' +
        'option, #24715.'
    );
});

QUnit.test('Inverted standalone navigator layout, #24714', function (assert) {
    const navigator = Highcharts.navigator('container', {
        chartOptions: {
            chart: {
                inverted: true,
                width: 50,
                height: 300
            }
        },
        series: [{
            data: [[0, 0], [600, 1]]
        }]
    });

    const nav = navigator.navigator,
        chart = nav.chart,
        scrollbar = nav.scrollbar,
        layout = () => ({
            left: nav.left,
            top: nav.top,
            scrollbarX: scrollbar.x,
            scrollbarY: scrollbar.y
        }),
        initialLayout = layout();

    // For a vertical scrollbar, `width` is its thickness across the chart
    assert.ok(
        scrollbar.x >= 0 &&
            scrollbar.x + scrollbar.width <= chart.chartWidth,
        'Scrollbar should render within the chart, not off its left edge.'
    );

    assert.ok(
        scrollbar.x < nav.left,
        'Scrollbar should sit to the left of the navigator.'
    );

    chart.redraw();

    assert.deepEqual(
        layout(),
        initialLayout,
        'Navigator and scrollbar should not move on the first redraw.'
    );
});

QUnit.test('Standalone navigator stays at the top, #24714', function (assert) {
    const navigator = Highcharts.navigator('container', {
        chartOptions: {
            chart: {
                width: 600,
                height: 150
            }
        },
        series: [{
            data: [[0, 0], [600, 1]]
        }]
    });

    const nav = navigator.navigator,
        scrollbar = nav.scrollbar;

    // The navigator is the whole chart, so a taller chart must not push it
    // towards the bottom the way it would in a chart with a plot area
    assert.ok(
        nav.top < nav.height,
        'Navigator should sit at the top of a chart taller than itself.'
    );

    assert.ok(
        scrollbar.y < nav.top + nav.height + scrollbar.height,
        'Scrollbar should follow the navigator, not the chart bottom.'
    );

    navigator.destroy();

    const sized = Highcharts.navigator('container', {
        height: 100,
        series: [{
            data: [[0, 0], [600, 1]]
        }]
    });

    assert.strictEqual(
        sized.navigator.chart.chartHeight,
        100,
        'Navigator height should set the chart height, #24714.'
    );

    sized.update({ chartOptions: { chart: { inverted: true } } });
    sized.update({ chartOptions: { chart: { inverted: false } } });

    assert.strictEqual(
        sized.navigator.chart.chartHeight,
        100,
        'Chart height should be restored after a round trip, #24714.'
    );

    sized.update({ chartOptions: { chart: { inverted: true } } });

    assert.strictEqual(
        sized.navigator.chart.chartWidth,
        70,
        'Inverted navigator should take its breadth across the width.'
    );
});
