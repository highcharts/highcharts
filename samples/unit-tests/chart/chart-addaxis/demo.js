QUnit.test('Add empty axis ', assert => {
    const chart = Highcharts.chart('container', {});

    chart.addAxis({
        floor: 0,
        max: 100
    }, false);
    chart.addSeries({
        data: [1, 3, 2, 4]
    }, false, false);

    chart.redraw(true);

    assert.ok(true, 'No JS errors should occur (#17678)');
});
