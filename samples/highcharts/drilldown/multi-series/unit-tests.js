QUnit.test('Drill down on points or categories', function (assert) {
    var chart = Highcharts.charts[0];

    chart.options.drilldown.animation = false;

    assert.equal(
        chart.series.length,
        2,
        '2 series on first level'
    );
    assert.equal(
        chart.series[0].name,
        '2010',
        'Check first series'
    );

    // Click first point
    Highcharts.fireEvent(chart.series[0].points[0], 'click');
    assert.equal(
        chart.series.length,
        1,
        '1 series on second level'
    );
    assert.equal(
        chart.series[0].name,
        'Series 3',
        'Check first series'
    );

    // ... and, we're back
    chart.drillUp();
    assert.equal(
        chart.series[0].name,
        '2010',
        'First level name'
    );

    // Click the category
    chart.xAxis[0].ticks[0].label.element.onclick();
    assert.equal(
        chart.series.length,
        2,
        '2 series on second level'
    );
    assert.equal(
        chart.series[0].name,
        'Series 3',
        'Check first series'
    );


});