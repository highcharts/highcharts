QUnit.test('Click to add', function (assert) {
    var chart = Highcharts.charts[0],
        offset = $(chart.container).offset();

    chart.pointer.onContainerClick({
        pageX: offset.left + 100,
        pageY: offset.top + 100,
        type: 'click',
        target: chart.renderer.box.querySelector('rect.highcharts-background')
    });

    chart.pointer.onContainerClick({
        pageX: offset.left + 300,
        pageY: offset.top + 100,
        type: 'click',
        target: chart.renderer.box.querySelector('rect.highcharts-background')
    });

    assert.equal(
        chart.series[0].points.length,
        4,
        'Four points added'
    );

});