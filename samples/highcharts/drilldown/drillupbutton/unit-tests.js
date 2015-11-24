QUnit.test('Drill-up text', function (assert) {

    var chart = Highcharts.charts[0];
    chart.options.drilldown.animation = false;

    assert.equal(
        chart.series.length,
        1,
        'Chart created'
    );

    chart.series[0].points[0].doDrilldown();
    assert.equal(
        chart.drillUpButton.element.textContent,
        '<< Terug naar Things',
        'Button text'
    );
    assert.equal(
        chart.drillUpButton.element.firstChild.getAttribute('fill'),
        'white',
        'Button fill'
    );

    assert.equal(
        chart.drillUpButton.element.firstChild.getAttribute('stroke'),
        'silver',
        'Button stroke'
    );
});