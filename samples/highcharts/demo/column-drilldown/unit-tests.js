QUnit.test('Column drilldown', function (assert) {
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
        'Microsoft Internet Explorer',
        'Second level name'
    );

    chart.drillUp();
    assert.equal(
        chart.series[0].name,
        'Brands',
        'First level name'
    );

});