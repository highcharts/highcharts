QUnit.test('Mouse interaction', function (assert) {

    var chart = Highcharts.charts[0],
        offset,
        x,
        y,
        ext;

    chart.setSize(800, 300, false);

    assert.strictEqual(
        chart.xAxis[0].getExtremes().min,
        0,
        'Initial min'
    );

    assert.strictEqual(
        chart.xAxis[0].getExtremes().max,
        11,
        'Initial min'
    );

    // Drag
    offset = $(chart.container).offset();
    x = 300 + offset.left;
    y = 200 + offset.top;

    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: x,
        pageY: y
    });
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: x + 100,
        pageY: y
    });
    chart.pointer.onDocumentMouseUp({});

    ext = chart.xAxis[0].getExtremes();
    assert.strictEqual(
        $('#report').html(),
        'Set extremes to ' + ext.min.toFixed(2) + ', ' + ext.max.toFixed(2),
        'Drag, report is updated'
    );

});