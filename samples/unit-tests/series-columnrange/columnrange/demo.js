QUnit.test('Column range and column series.', assert => {
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'column'
        },
        plotOptions: {
            columnrange: {
                centerInCategory: true
            },
            series: {
                borderWidth: 0
            }
        },
        series: [{
            data: [2],
            pointWidth: 40
        }, {
            type: 'columnrange',
            pointWidth: 20,
            data: [{
                high: 2,
                low: 1,
                x: 0
            }]
        }]
    });

    assert.ok(true, 'Enabling centerInCategory should not throw');

    assert.strictEqual(
        chart.series[0].points[0].graphic.getBBox().y,
        chart.series[1].points[0].graphic.getBBox().y,
        'Column range points and columns should be aligned, #17912.'
    );
});

QUnit.test('Column range with series.keys and x categories, #23961', assert => {
    const isNumber = Highcharts.isNumber;
    const chart = Highcharts.chart('container', {
        chart: {
            type: 'columnrange'
        },
        series: [{
            type: 'columnrange',
            data: [
                ['Jan', -9.5, 8],
                ['Feb', -7.8, 8.3],
                ['Mar', -13.1, 9.2],
                ['Apr', -4.4, 15.7]
            ],
            keys: ['x', 'low', 'high']
        }]
    });

    const series = chart.series[0];
    const point = series.points[0];
    const xAxis = chart.xAxis[0];

    assert.strictEqual(series.points.length, 4, 'Should have 4 points');

    assert.ok(
        isNumber(point.x) && point.x >= 0,
        'First point should have numeric category index (got: ' + point.x + ')'
    );
    assert.ok(
        isNumber(point.low) && isNumber(point.high),
        'First point should have low and high'
    );
    assert.ok(
        isNumber(point.shapeArgs?.width) && point.shapeArgs.width > 0,
        'First point should have valid shapeArgs.width for rendering'
    );
    assert.ok(point.graphic, 'First point should have rendered graphic');

    assert.ok(
        xAxis.tickPositions.length > 0 && isNumber(xAxis.tickPositions[0]),
        'First tick position should be a number'
    );

    xAxis.update({ type: 'category' }, true);

    const firstTickPos = xAxis.tickPositions[0];
    assert.strictEqual(
        xAxis.ticks[firstTickPos]?.label?.textStr,
        'Jan',
        'First tick label should be Jan'
    );
});
