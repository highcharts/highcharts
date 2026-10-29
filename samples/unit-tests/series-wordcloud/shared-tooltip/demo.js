QUnit.test('Wordcloud with shared tooltip (#25448)', function (assert) {
    const chart = Highcharts.chart('container', {
            chart: {
                width: 600,
                height: 400
            },
            tooltip: {
                shared: true
            },
            series: [{
                type: 'wordcloud',
                data: [
                    { name: 'One', y: 1, weight: 1 },
                    { name: 'Two', y: 2, weight: 2 },
                    { name: 'Three', y: 3, weight: 3 }
                ]
            }]
        }),
        series = chart.series[0],
        controller = new TestController(chart);

    assert.strictEqual(
        series.stickyTracking,
        false,
        'Shared tooltip should not enable sticky tracking on wordcloud'
    );

    // Hover an empty corner of the plot area, far away from the words
    controller.moveTo(chart.plotLeft + 5, chart.plotTop + 5);

    assert.strictEqual(
        chart.hoverPoint,
        void 0,
        'Hovering empty space should not highlight any word'
    );

    assert.ok(
        chart.tooltip.isHidden,
        'Tooltip should stay hidden when hovering empty space'
    );

    // Hovering a word should still work
    const wordBox = series.points[2].graphic.element.getBoundingClientRect(),
        containerBox = chart.container.getBoundingClientRect();

    controller.moveTo(
        wordBox.left - containerBox.left + wordBox.width / 2,
        wordBox.top - containerBox.top + wordBox.height / 2
    );

    assert.strictEqual(
        chart.hoverPoint,
        series.points[2],
        'Hovering a word should highlight that word'
    );

    assert.notOk(
        chart.tooltip.isHidden,
        'Tooltip should be shown for the hovered word'
    );
});
