QUnit.test('Chart select points by drag', function (assert) {
    var chart = Highcharts.charts[0];

    // Prepare
    chart.setSize(400, 400, false);
    $('#container').css({
        position: 'absolute',
        top: 0,
        left: 0
    });

    setTimeout(function () {
        $('#container').css({
            position: 'static'
        });
    }, 0);


    assert.strictEqual(
        chart.getSelectedPoints().length,
        0,
        'No selected points initially'
    );

    chart.pointer.onContainerMouseDown({
        type: 'mousedown',
        pageX: 200,
        pageY: 200
    });
    chart.pointer.onContainerMouseMove({
        type: 'mousemove',
        pageX: 300,
        pageY: 300
    });
    chart.pointer.onDocumentMouseUp({});

    assert.strictEqual(
        chart.getSelectedPoints().length > 0,
        true,
        'Has selected points after drag'
    );
});