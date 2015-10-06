QUnit.test('Drilldown across types', function (assert) {
    var chart = Highcharts.charts[0];

    chart.options.drilldown.animation = false;

    assert.equal(
        chart.series.length,
        1,
        'Chart created'
    );

    chart.series[0].points[0].doDrilldown();
    assert.equal(
        chart.series[0].name,
        'Series 2',
        'Second level name'
    );

    assert.equal(
        chart.series[0].type,
        'pie',
        'Second level type'
    );

    // Check that the point actually draws an arc
    assert.equal(
        typeof chart.series[0].points[0].graphic.element.getAttribute('d').indexOf('A'),
        'number',
        'Point is arc'
    );
    assert.notEqual(
        chart.series[0].points[0].graphic.element.getAttribute('d').indexOf('A'),
        -1,
        'Point is arc'
    );

    chart.drillUp();
    assert.equal(
        chart.series[0].name,
        'Things',
        'First level name'
    );
    assert.equal(
        chart.series[0].type,
        'column',
        'First level type'
    );

});